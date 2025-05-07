import { useChatStore } from "../store/useChatStore";

const BASE_URL = "ws://127.0.0.1:8000/ws/chat";
//@ts-ignore

export class MessagingManager {
  private ws: WebSocket;
  private token: string | null;
  private isInitialised: boolean = false;
  private static instance: MessagingManager | null = null;
  private bufferedMessages: any[] = [];
  private reconnectInterval: number = 3000;
  private setMessage: (message: any) => void; // 3 seconds for auto-reconnect

  private constructor(id: number,setMessages: (message: any) => void) {
    this.token = localStorage.getItem("token");
    this.ws = new WebSocket(`${BASE_URL}/${id}/?token=${this.token}`);
    this.setMessage = setMessages;
    this.init(id);
  }

  // ✅ Singleton Pattern
  public static getInstance(id: number,setMessages: (message: any) => void): MessagingManager {
    if (!this.instance) {
      this.instance = new MessagingManager(id,setMessages);
    }
    return this.instance;
  }

  // ✅ Properly Destroy the Instance
  public static destroy(): void {
    if (this.instance) {
      console.log("Destroying MessagingManager instance...");
      if (this.instance.ws.readyState === WebSocket.OPEN) {
        this.instance.ws.close();
        
      }
      this.instance.isInitialised = false;
      this.instance = null;
    }
  }

  // ✅ Initialize WebSocket with Proper Handlers
  private init(id: number) {
    this.ws.onopen = () => {
      console.log("WebSocket connected ✅");
      this.isInitialised = true;
      this.flushBufferedMessages();
    };
  
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.setMessage(message);
    };
  
    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.reconnect(id);
    };
  
    this.ws.onclose = (event) => {
      console.warn("WebSocket disconnected ❌", event);
      this.reconnect(id);
    };
  }
  
  private reconnect(id: number) {
    if (this.ws.readyState !== WebSocket.CONNECTING && this.ws.readyState !== WebSocket.OPEN) {
      this.isInitialised = false;
      setTimeout(() => {
        try {
          this.ws = new WebSocket(`${BASE_URL}/${id}/?token=${this.token}`);
          this.init(id);
        } catch (error) {
          console.error("Reconnection failed:", error);
        }
      }, this.reconnectInterval);
    }
  }

  // ✅ Buffer Messages if Connection is Not Ready
  public sendMessage(message: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open. Buffering message...");
      this.bufferedMessages.push(message);
    }
  }

  // ✅ Flush Buffered Messages When WebSocket Opens
  private flushBufferedMessages() {
    this.bufferedMessages.forEach((msg) => this.ws.send(JSON.stringify(msg)));
    this.bufferedMessages = [];
  }
}
