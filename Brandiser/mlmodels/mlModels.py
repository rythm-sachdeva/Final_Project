from transformers import pipeline, TFAutoModelForSequenceClassification, AutoTokenizer
from typing import Dict
import tensorflow as tf

class TransformerModel():
    def __init__(self):
        self.emotion_model = pipeline(
            'text-classification',
            model='SamLowe/roberta-base-go_emotions',
            return_all_scores=True,
            framework="tf"  
        )
        
        self.sarcasm_tokenizer = AutoTokenizer.from_pretrained("MohamedGalal/marbert-sarcasm-detector")
        self.sarcasm_model = TFAutoModelForSequenceClassification.from_pretrained(
            "MohamedGalal/marbert-sarcasm-detector"
        )

        # Sentiment analysis model (TensorFlow)
        self.sentiment_model = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment-latest",
            framework="tf"
        )

        # Brand perception model (TensorFlow)
        self.perception_model = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
            framework="tf"
        )

    def detect_emotions(self, text: str) -> Dict:
        results = self.emotion_model(text)[0]
        return {item['label']: item['score'] for item in results}
    
    def detect_sarcasm(self, text: str) -> Dict:
        inputs = self.sarcasm_tokenizer(text, return_tensors="tf", truncation=True)
        outputs = self.sarcasm_model(**inputs)
        probs = tf.nn.softmax(outputs.logits, axis=1)
        return {
            'sarcastic': float(probs[0][1]),
            'literal': float(probs[0][0])
        }
    
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