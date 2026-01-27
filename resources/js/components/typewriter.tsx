import { useEffect, useState } from 'react';

interface TypewriterProps {
    texts: string[];
    speed?: number;
    delayBetween?: number;
}

export default function Typewriter({ texts, speed = 100, delayBetween = 2000 }: TypewriterProps) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentChars, setCurrentChars] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const text = texts[currentTextIndex];
        let timeout: NodeJS.Timeout;

        if (!isDeleting && currentChars.length < text.length) {
            // Typing
            timeout = setTimeout(() => {
                setCurrentChars(text.substring(0, currentChars.length + 1));
            }, speed);
        } else if (!isDeleting && currentChars.length === text.length) {
            // Wait before deleting
            timeout = setTimeout(() => {
                setIsDeleting(true);
            }, delayBetween);
        } else if (isDeleting && currentChars.length > 0) {
            // Deleting
            timeout = setTimeout(() => {
                setCurrentChars(text.substring(0, currentChars.length - 1));
            }, speed / 2);
        } else if (isDeleting && currentChars.length === 0) {
            // Switch to next text
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }

        return () => clearTimeout(timeout);
    }, [currentChars, isDeleting, currentTextIndex, texts, speed, delayBetween]);

    return (
        <span className="inline-block">
            {currentChars}
            <span className="typewriter-cursor" />
        </span>
    );
}
