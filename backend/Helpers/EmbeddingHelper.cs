public static class EmbeddingHelper
{
    public static float CosineSimilarity(List<float> a, List<float> b)
    {
        if (a.Count != b.Count)
            throw new Exception("Embedding size mismatch");

        float dot = 0;
        float magA = 0;
        float magB = 0;

        for (int i = 0; i < a.Count; i++)
        {
            dot += a[i] * b[i];
            magA += a[i] * a[i];
            magB += b[i] * b[i];
        }

        return dot / (float)(Math.Sqrt(magA) * Math.Sqrt(magB));
    }
}