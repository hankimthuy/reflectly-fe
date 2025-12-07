import { EMOTION_DATA, type Emotion } from "../../models/emotion";

export const EmotionTag = ({ emotion }: { emotion: Emotion }) => {
    const emotionData = EMOTION_DATA[emotion];

    if (!emotionData) return null;

    return (
        <div style={{ border: `2px solid ${emotionData.color}` }}
            className="emotion-tag-wrapper">
            <span>{emotionData.icon}</span>
            <span className="emotion-label">{emotionData.label}</span>
        </div>
    )
}

export const EmotionTags = ({ emotions }: { emotions: Emotion[] }) => {
    if (!emotions || emotions.length === 0) return null;

    return (
        <div className="emotion-tags-list">
            {emotions.map((emotionKey, index) => (
                <EmotionTag key={`${emotionKey}-${index}`} emotion={emotionKey}></EmotionTag>
            ))}
        </div>
    )
}