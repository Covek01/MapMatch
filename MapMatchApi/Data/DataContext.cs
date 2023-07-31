using Microsoft.EntityFrameworkCore;

namespace MapMatchApi.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<RegisteredUser> RegisteredUsers { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<Group> Groups { get; set; }

        public DbSet<Request> Requests { get; set; }

        public DbSet<DirectMessage> DirectMessages { get; set; }
        public DbSet<GroupMessage> GroupMessages { get; set; }

        public DbSet<Poll> Polls { get; set; }
        public DbSet<UserGroupVisibility> UserGroupVisibilities { get; set; }
        public DbSet<LocationSharing> LocationSharings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<RegisteredUser>()
                    .HasMany(r => r.Friendships)
                    .WithOne(f => f.FriendshipOwner).OnDelete(DeleteBehavior.NoAction);//
            modelBuilder.Entity<RegisteredUser>()
                .HasMany(r => r.IsFriendTo)
                .WithOne(f => f.Friend).OnDelete(DeleteBehavior.NoAction);//
            modelBuilder.Entity<RegisteredUser>()
                .HasMany(r => r.SharedLocationFrom)
                .WithOne(r => r.SharedTo);
            modelBuilder.Entity<RegisteredUser>()
                .HasMany(r => r.SharedLocationTo)
                .WithOne(r => r.SharedFrom);

            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.FriendshipOwner)
                .WithMany(r => r.Friendships).OnDelete(DeleteBehavior.NoAction);//
            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.Friend)
                .WithMany(r => r.IsFriendTo).OnDelete(DeleteBehavior.NoAction);//
            //modelBuilder.Entity<Friendship>()
            //    .HasOne(p => p.FriendshipOwner)
            //    .WithOne(l => l.);
            //modelBuilder.Entity<Friendship>()
            //    .HasOne(p => p.Friend2)
            //    .WithMany(l => l.Friends2);
            modelBuilder.Entity<Group>()
                .HasOne(p => p.Admin)
                .WithMany(l => l.GroupAdmin);

            modelBuilder.Entity<Request>()
                .HasOne(p => p.Sender)
                .WithMany(l => l.SentRequests)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Request>()
                .HasOne(p => p.Receiver)
                .WithMany(l => l.ReceivedRequests)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Request>()
                .HasOne(p => p.RefersTo)
                .WithMany(l => l.ReferedTo)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<DirectMessage>()
                .HasOne(d => d.Sender)
                .WithMany(r => r.SentDirectMessages)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<DirectMessage>()
                .HasOne(d => d.Receiver)
                .WithMany(r => r.ReceivedDirectMessages)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<GroupMessage>()
                .HasOne(g => g.Sender)
                .WithMany(r => r.SentGroupMessages)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Group>()
                .HasOne(g => g.Admin)
                .WithMany(r => r.GroupAdmin)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Group>()
                .HasMany(g => g.Members)
                .WithMany(r => r.GroupMemeber);

            modelBuilder.Entity<Group>()
                .HasMany(g => g.GroupChat)
                .WithOne(gm => gm.Group)
                .OnDelete(DeleteBehavior.NoAction);
               

            //foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            //{
            //    relationship.DeleteBehavior = DeleteBehavior.NoAction;
            //}

            base.OnModelCreating(modelBuilder);
        }
    }
}
