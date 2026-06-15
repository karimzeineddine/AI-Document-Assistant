namespace AI.DocumentAssistant.API.Helpers
{
    public static class TextChunker
    {
        public static List<string> SplitText(string text, int chunkSize = 400, int overlapSize = 80)
        {
            var chunks = new List<string>();

            // Split into words, preserving spacing
            var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            var currentChunk = new List<string>();
            var currentLength = 0;

            for (int i = 0; i < words.Length; i++)
            {
                var word = words[i];
                currentChunk.Add(word);
                currentLength += word.Length + 1; // +1 for the space

                if (currentLength >= chunkSize)
                {
                    chunks.Add(string.Join(" ", currentChunk));

                    // Overlap: rewind by keeping the last `overlapSize` worth of words
                    var overlapWords = new List<string>();
                    var overlapLength = 0;

                    for (int j = currentChunk.Count - 1; j >= 0; j--)
                    {
                        overlapLength += currentChunk[j].Length + 1;
                        if (overlapLength > overlapSize) break;
                        overlapWords.Insert(0, currentChunk[j]);
                    }

                    currentChunk = overlapWords;
                    currentLength = overlapLength;
                }
            }

            // Don't forget the last chunk
            if (currentChunk.Count > 0)
                chunks.Add(string.Join(" ", currentChunk));

            return chunks;
        }
    }
}