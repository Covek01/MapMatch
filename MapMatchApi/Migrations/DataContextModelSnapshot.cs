﻿// <auto-generated />
using System;
using MapMatchApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace MapMatchApi.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("GroupRegisteredUser", b =>
                {
                    b.Property<int>("GroupMemeberId")
                        .HasColumnType("int");

                    b.Property<int>("MembersId")
                        .HasColumnType("int");

                    b.HasKey("GroupMemeberId", "MembersId");

                    b.HasIndex("MembersId");

                    b.ToTable("GroupRegisteredUser");
                });

            modelBuilder.Entity("MapMatchApi.Models.DirectMessage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ChatId")
                        .HasColumnType("int");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ReceiverId")
                        .HasColumnType("int");

                    b.Property<DateTime>("SendTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("SenderId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ChatId");

                    b.HasIndex("ReceiverId");

                    b.HasIndex("SenderId");

                    b.ToTable("DirectMessages");
                });

            modelBuilder.Entity("MapMatchApi.Models.Friendship", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("FriendId")
                        .HasColumnType("int");

                    b.Property<DateTime>("FriendsSince")
                        .HasColumnType("datetime2");

                    b.Property<int>("FriendshipOwnerId")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastMessage")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("FriendId");

                    b.HasIndex("FriendshipOwnerId");

                    b.ToTable("Friendships");
                });

            modelBuilder.Entity("MapMatchApi.Models.Group", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AdminId")
                        .HasColumnType("int");

                    b.Property<string>("JoinCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("LastMessage")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhotoPath")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PreferedColor")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("AdminId");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("MapMatchApi.Models.GroupMessage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("GroupId")
                        .HasColumnType("int");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("SendTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("SenderId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.HasIndex("SenderId");

                    b.ToTable("GroupMessages");
                });

            modelBuilder.Entity("MapMatchApi.Models.LocationSharing", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("SharedFromId")
                        .HasColumnType("int");

                    b.Property<int?>("SharedToId")
                        .HasColumnType("int");

                    b.Property<int>("durationInMinutes")
                        .HasColumnType("int");

                    b.Property<DateTime>("timeOfShare")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("SharedFromId");

                    b.HasIndex("SharedToId");

                    b.ToTable("LocationSharings");
                });

            modelBuilder.Entity("MapMatchApi.Models.Poll", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("MyGroupId")
                        .HasColumnType("int");

                    b.Property<int>("NumberOfYes")
                        .HasColumnType("int");

                    b.Property<int>("NumberoOfNo")
                        .HasColumnType("int");

                    b.Property<string>("PollName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("TimeOfCreate")
                        .HasColumnType("datetime2");

                    b.Property<int>("TimeToLive")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("MyGroupId");

                    b.ToTable("Polls");
                });

            modelBuilder.Entity("MapMatchApi.Models.RegisteredUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("AccountVerified")
                        .HasColumnType("bit");

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("FutureLatitude")
                        .HasColumnType("float");

                    b.Property<double?>("FutureLongitude")
                        .HasColumnType("float");

                    b.Property<bool>("IsAdmin")
                        .HasColumnType("bit");

                    b.Property<bool>("IsVisible")
                        .HasColumnType("bit");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("LastPasswordChange")
                        .HasColumnType("datetime2");

                    b.Property<double?>("Latitude")
                        .HasColumnType("float");

                    b.Property<double?>("Longitude")
                        .HasColumnType("float");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProfilePhoto")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("SuspendedTill")
                        .HasColumnType("datetime2");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("VerificationCode")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("RegisteredUsers");
                });

            modelBuilder.Entity("MapMatchApi.Models.Request", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("Active")
                        .HasColumnType("bit");

                    b.Property<int?>("InvitedToJoinGroupId")
                        .HasColumnType("int");

                    b.Property<int>("ReceiverId")
                        .HasColumnType("int");

                    b.Property<int?>("RefersToId")
                        .HasColumnType("int");

                    b.Property<string>("RequestMessage")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("SendTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("SenderId")
                        .HasColumnType("int");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("isSpam")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("InvitedToJoinGroupId");

                    b.HasIndex("ReceiverId");

                    b.HasIndex("RefersToId");

                    b.HasIndex("SenderId");

                    b.ToTable("Requests");
                });

            modelBuilder.Entity("MapMatchApi.Models.UserGroupVisibility", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("GrupaId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<bool>("isVisible")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("GrupaId");

                    b.HasIndex("UserId");

                    b.ToTable("UserGroupVisibilities");
                });

            modelBuilder.Entity("GroupRegisteredUser", b =>
                {
                    b.HasOne("MapMatchApi.Models.Group", null)
                        .WithMany()
                        .HasForeignKey("GroupMemeberId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MapMatchApi.Models.RegisteredUser", null)
                        .WithMany()
                        .HasForeignKey("MembersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MapMatchApi.Models.DirectMessage", b =>
                {
                    b.HasOne("MapMatchApi.Models.Friendship", "Chat")
                        .WithMany("DirectChat")
                        .HasForeignKey("ChatId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MapMatchApi.Models.RegisteredUser", "Receiver")
                        .WithMany("ReceivedDirectMessages")
                        .HasForeignKey("ReceiverId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("MapMatchApi.Models.RegisteredUser", "Sender")
                        .WithMany("SentDirectMessages")
                        .HasForeignKey("SenderId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Chat");

                    b.Navigation("Receiver");

                    b.Navigation("Sender");
                });

            modelBuilder.Entity("MapMatchApi.Models.Friendship", b =>
                {
                    b.HasOne("MapMatchApi.Models.RegisteredUser", "Friend")
                        .WithMany("IsFriendTo")
                        .HasForeignKey("FriendId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("MapMatchApi.Models.RegisteredUser", "FriendshipOwner")
                        .WithMany("Friendships")
                        .HasForeignKey("FriendshipOwnerId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Friend");

                    b.Navigation("FriendshipOwner");
                });

            modelBuilder.Entity("MapMatchApi.Models.Group", b =>
                {
                    b.HasOne("MapMatchApi.Models.RegisteredUser", "Admin")
                        .WithMany("GroupAdmin")
                        .HasForeignKey("AdminId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Admin");
                });

            modelBuilder.Entity("MapMatchApi.Models.GroupMessage", b =>
                {
                    b.HasOne("MapMatchApi.Models.Group", "Group")
                        .WithMany("GroupChat")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("MapMatchApi.Models.RegisteredUser", "Sender")
                        .WithMany("SentGroupMessages")
                        .HasForeignKey("SenderId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Group");

                    b.Navigation("Sender");
                });

            modelBuilder.Entity("MapMatchApi.Models.LocationSharing", b =>
                {
                    b.HasOne("MapMatchApi.Models.RegisteredUser", "SharedFrom")
                        .WithMany("SharedLocationTo")
                        .HasForeignKey("SharedFromId");

                    b.HasOne("MapMatchApi.Models.RegisteredUser", "SharedTo")
                        .WithMany("SharedLocationFrom")
                        .HasForeignKey("SharedToId");

                    b.Navigation("SharedFrom");

                    b.Navigation("SharedTo");
                });

            modelBuilder.Entity("MapMatchApi.Models.Poll", b =>
                {
                    b.HasOne("MapMatchApi.Models.Group", "MyGroup")
                        .WithMany("ListOfPolls")
                        .HasForeignKey("MyGroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MyGroup");
                });

            modelBuilder.Entity("MapMatchApi.Models.Request", b =>
                {
                    b.HasOne("MapMatchApi.Models.Group", "InvitedToJoinGroup")
                        .WithMany()
                        .HasForeignKey("InvitedToJoinGroupId");

                    b.HasOne("MapMatchApi.Models.RegisteredUser", "Receiver")
                        .WithMany("ReceivedRequests")
                        .HasForeignKey("ReceiverId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("MapMatchApi.Models.RegisteredUser", "RefersTo")
                        .WithMany("ReferedTo")
                        .HasForeignKey("RefersToId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.HasOne("MapMatchApi.Models.RegisteredUser", "Sender")
                        .WithMany("SentRequests")
                        .HasForeignKey("SenderId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("InvitedToJoinGroup");

                    b.Navigation("Receiver");

                    b.Navigation("RefersTo");

                    b.Navigation("Sender");
                });

            modelBuilder.Entity("MapMatchApi.Models.UserGroupVisibility", b =>
                {
                    b.HasOne("MapMatchApi.Models.Group", "Grupa")
                        .WithMany("MemebersVisibility")
                        .HasForeignKey("GrupaId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MapMatchApi.Models.RegisteredUser", "User")
                        .WithMany("GroupsVisibility")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Grupa");

                    b.Navigation("User");
                });

            modelBuilder.Entity("MapMatchApi.Models.Friendship", b =>
                {
                    b.Navigation("DirectChat");
                });

            modelBuilder.Entity("MapMatchApi.Models.Group", b =>
                {
                    b.Navigation("GroupChat");

                    b.Navigation("ListOfPolls");

                    b.Navigation("MemebersVisibility");
                });

            modelBuilder.Entity("MapMatchApi.Models.RegisteredUser", b =>
                {
                    b.Navigation("Friendships");

                    b.Navigation("GroupAdmin");

                    b.Navigation("GroupsVisibility");

                    b.Navigation("IsFriendTo");

                    b.Navigation("ReceivedDirectMessages");

                    b.Navigation("ReceivedRequests");

                    b.Navigation("ReferedTo");

                    b.Navigation("SentDirectMessages");

                    b.Navigation("SentGroupMessages");

                    b.Navigation("SentRequests");

                    b.Navigation("SharedLocationFrom");

                    b.Navigation("SharedLocationTo");
                });
#pragma warning restore 612, 618
        }
    }
}
