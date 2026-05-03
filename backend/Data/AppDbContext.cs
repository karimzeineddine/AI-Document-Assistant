using Microsoft.EntityFrameworkCore;
using AI.DocumentAssistant.API.Models;

namespace AI.DocumentAssistant.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // AppDbContext.cs - OnModelCreating
            modelBuilder.Entity<DocumentChunk>()
                .Property(c => c.ChunkIndex)
                .HasColumnType("integer");
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<DocumentChunk> DocumentChunks { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }
    }
}