import re
import string
from collections import Counter
from typing import List, Dict, Any
from textblob import TextBlob


STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
    "for", "of", "with", "is", "it", "its", "this", "that", "was",
    "are", "were", "be", "been", "have", "has", "do", "does", "did",
    "will", "would", "could", "should", "i", "you", "he", "she",
    "we", "they", "from", "as", "by", "not", "so", "if", "about",
    "also", "just", "more", "than", "then", "into", "can", "up",
    "what", "how", "when", "all", "like", "very", "my", "your",
    "our", "their", "me", "him", "her", "us", "them"
}


def analyze(transcript: str) -> Dict[str, Any]:
    sentences = re.split(r'(?<=[.!?])\s+', transcript)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    sentiment_arc = []
    subjectivity_scores = []
    word_counts = []
    content_words_all = []
    
    for sentence in sentences:
        blob = TextBlob(sentence)
        sentiment_arc.append(round(blob.sentiment.polarity, 4))
        subjectivity_scores.append(blob.sentiment.subjectivity)
        words = sentence.lower().translate(str.maketrans("", "", string.punctuation)).split()
        words = [w for w in words if w not in STOPWORDS and len(w) > 2]
        content_words_all.extend(words)
        word_counts.append(len(words))
    
    avg_sentence_length = sum(word_counts) / len(word_counts) if word_counts else 0.0
    
    content_word_counts = Counter(content_words_all)
    top_keywords = [
        {"word": word, "count": count}
        for word, count in content_word_counts.most_common(10)
    ]
    
    bigrams = [
        f"{content_words_all[i]} {content_words_all[i+1]}"
        for i in range(len(content_words_all) - 1)
    ]
    bigram_counts = Counter(bigrams)
    top_bigrams = [bg for bg, _ in bigram_counts.most_common(5)]
    
    overall_sentiment = sum(sentiment_arc) / len(sentiment_arc) if sentiment_arc else 0.0
    if overall_sentiment > 0.05:
        sentiment_label = "positive"
    elif overall_sentiment < -0.05:
        sentiment_label = "negative"
    else:
        sentiment_label = "neutral"
    
    overall_subjectivity = sum(subjectivity_scores) / len(subjectivity_scores) if subjectivity_scores else 0.0
    
    all_words = transcript.lower().translate(str.maketrans("", "", string.punctuation)).split()
    word_count = len(all_words)
    
    content_word_lengths = [len(w) for w in content_words_all]
    readability_score = sum(content_word_lengths) / len(content_word_lengths) if content_word_lengths else 0.0
    
    sentence_count = len(sentences)
    
    return {
        "word_count": word_count,
        "sentence_count": sentence_count,
        "avg_sentence_length": round(avg_sentence_length, 2),
        "sentiment_overall": round(overall_sentiment, 4),
        "sentiment_label": sentiment_label,
        "subjectivity": round(overall_subjectivity, 4),
        "top_keywords": top_keywords,
        "sentiment_arc": sentiment_arc,
        "top_bigrams": top_bigrams,
        "readability_score": round(readability_score, 2)
    }
