namespace AI.DocumentAssistant.API.Helpers
{
    public static class TextChunker
    {
        public static List<string> SplitText(string text, int chunkSize = 500)
        {
            var chunks = new List<string>();

            for (int i = 0; i < text.Length; i += chunkSize)
            {
                chunks.Add(text.Substring(i, Math.Min(chunkSize, text.Length - i)));
            }

            return chunks;
        }
    }
}