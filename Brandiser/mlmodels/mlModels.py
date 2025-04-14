from transformers import pipeline, AutoModelForSequenceClassification,AutoTokenizer
from typing import Dict

#Ml Models 

class TransformerModel():
    def __init__(self):
        #emotion detection model
        self.emotion_model = pipeline('text-classification',model='SamLowe/roberta-base-go_emotions',return_all_scores=True)
        self.sarcasm_tokenizer = AutoTokenizer.from_pretrained("sismetanin/roberta-base-sarcasm-twitter")
        self.sarcasm_model = AutoModelForSequenceClassification.from_pretrained("sismetanin/roberta-base-sarcasm-twitter")

        self.sentiment_model = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment-latest"
        )
        self.perception_model = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli"
        )

    def detect_emotions(self, text: str) -> Dict:
        results = self.emotion_model(text)[0]
        return {item['label']: item['score'] for item in results}
    
    def detect_sarcasm(self, text: str) -> Dict:
        inputs = self.sarcasm_tokenizer(text, return_tensors="pt", truncation=True)
        outputs = self.sarcasm_model(**inputs)
        probs = outputs.logits.softmax(dim=1)
        return {'sarcastic': probs[0][1].item(), 'literal': probs[0][0].item()}
    

    def analyze_sentiment(self, text: str) -> Dict:
        result = self.sentiment_model(text)[0]
        return {'label': result['label'], 'score': result['score']}
    
    def assess_brand_perception(self, text: str, brand_name: str) -> Dict:
        candidate_labels = [
            "positive", "negative", "trustworthy", 
            "innovative", "expensive", "good value",
            "reliable", "poor quality", "luxury",
            "outdated", "trendy", "ethical"
        ]
        result = self.perception_model(text, candidate_labels, multi_label=True)
        return {
            'brand': brand_name,
            'perception_scores': dict(zip(result['labels'], result['scores']))
        }
    
    def full_analysis(self, text: str, brand_name: str) -> Dict:
        return {
            "text": text,
            "emotions": self.detect_emotions(text),
            "sarcasm": self.detect_sarcasm(text),
            "sentiment": self.analyze_sentiment(text),
            "brand_perception": self.assess_brand_perception(text, brand_name)
        }

class LstmModel():
    pass
    
    

