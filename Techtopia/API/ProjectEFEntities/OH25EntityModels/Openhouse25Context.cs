using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace ProjectEFEntities.OH25EntityModels;

public partial class Openhouse25Context : DbContext
{
    public Openhouse25Context()
    {
    }

    public Openhouse25Context(DbContextOptions<Openhouse25Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Booth> Booths { get; set; }

    public virtual DbSet<LuggageTagColor> LuggageTagColors { get; set; }

    public virtual DbSet<RedemptionQueue> RedemptionQueues { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<ViewBoothsVisited> ViewBoothsVisiteds { get; set; }

    public virtual DbSet<Visitor> Visitors { get; set; }

    public virtual DbSet<VisitorBooth> VisitorBooths { get; set; }

    public virtual DbSet<VisitorWorkshop> VisitorWorkshops { get; set; }

    public virtual DbSet<Workshop> Workshops { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=docfiledb-t2.cxljlbpdqrxq.ap-southeast-1.rds.amazonaws.com,3306;user id=dotnetdev01;password=Dotnetdev@123;persist security info=True;database=openhouse25", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.35-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Booth>(entity =>
        {
            entity.HasKey(e => e.BoothId).HasName("PRIMARY");

            entity.ToTable("booth");

            entity.Property(e => e.BoothId).HasColumnName("booth_id");
            entity.Property(e => e.BoothDescription)
                .HasMaxLength(512)
                .HasColumnName("booth_description");
            entity.Property(e => e.BoothName)
                .HasMaxLength(45)
                .HasColumnName("booth_name");
        });

        modelBuilder.Entity<LuggageTagColor>(entity =>
        {
            entity.HasKey(e => e.LuggageTagColorName).HasName("PRIMARY");

            entity.ToTable("luggage_tag_colors");

            entity.HasIndex(e => e.LuggageTagColorCode, "luggage_tag_color_code_UNIQUE").IsUnique();

            entity.Property(e => e.LuggageTagColorName)
                .HasMaxLength(64)
                .HasColumnName("luggage_tag_color_name");
            entity.Property(e => e.LuggageTagColorCode)
                .HasMaxLength(9)
                .IsFixedLength()
                .HasColumnName("luggage_tag_color_code");
        });

        modelBuilder.Entity<RedemptionQueue>(entity =>
        {
            entity.HasKey(e => e.Queueid).HasName("PRIMARY");

            entity.ToTable("redemption_queue");

            entity.HasIndex(e => e.LuggageTagColor, "FK_luggage_tag_colors_idx");

            entity.HasIndex(e => e.VisitorId, "FK_queue_visitor_id_idx");

            entity.Property(e => e.Queueid).HasColumnName("queueid");
            entity.Property(e => e.DateCollected)
                .HasColumnType("datetime")
                .HasColumnName("date_collected");
            entity.Property(e => e.DateEngravingStart)
                .HasColumnType("datetime")
                .HasColumnName("date_engraving_start");
            entity.Property(e => e.DateJoined)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("date_joined");
            entity.Property(e => e.DatePendingCollection)
                .HasColumnType("datetime")
                .HasColumnName("date_pending_collection");
            entity.Property(e => e.EngravingText)
                .HasMaxLength(12)
                .HasColumnName("engraving_text")
                .UseCollation("utf8mb3_general_ci")
                .HasCharSet("utf8mb3");
            entity.Property(e => e.LuggageTagColor)
                .HasMaxLength(64)
                .HasColumnName("luggage_tag_color");
            entity.Property(e => e.VisitorId).HasColumnName("visitor_id");

            entity.HasOne(d => d.LuggageTagColorNavigation).WithMany(p => p.RedemptionQueues)
                .HasForeignKey(d => d.LuggageTagColor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_luggage_tag_colors");

            entity.HasOne(d => d.Visitor).WithMany(p => p.RedemptionQueues)
                .HasForeignKey(d => d.VisitorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_queue_visitor_id");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserName).HasName("PRIMARY");

            entity.ToTable("user", tb => tb.HasComment("Accounts for Booth Admins"));

            entity.Property(e => e.UserName)
                .HasMaxLength(32)
                .HasColumnName("user_name");
            entity.Property(e => e.Password)
                .HasColumnType("text")
                .HasColumnName("password");
        });

        modelBuilder.Entity<ViewBoothsVisited>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("view_booths_visited");
        });

        modelBuilder.Entity<Visitor>(entity =>
        {
            entity.HasKey(e => e.VisitorId).HasName("PRIMARY");

            entity.ToTable("visitor");

            entity.HasIndex(e => e.LuggageTagColorName, "FK_luggage_tag_color_idx");

            entity.HasIndex(e => e.TicketId, "ticket_id_UNIQUE").IsUnique();

            entity.Property(e => e.VisitorId).HasColumnName("visitor_id");
            entity.Property(e => e.Datecreated)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("datecreated");
            entity.Property(e => e.LuggageRedeemed)
                .HasDefaultValueSql("b'0'")
                .HasColumnType("bit(1)")
                .HasColumnName("luggage_redeemed");
            entity.Property(e => e.LuggageTagColorName)
                .HasMaxLength(64)
                .HasComment("ARGB")
                .HasColumnName("luggage_tag_color_name");
            entity.Property(e => e.TicketId)
                .HasMaxLength(12)
                .HasComment("In the format of <DDD><visitor_id><random_3_alphabets>")
                .HasColumnName("ticket_id");

            entity.HasOne(d => d.LuggageTagColorNameNavigation).WithMany(p => p.Visitors)
                .HasForeignKey(d => d.LuggageTagColorName)
                .HasConstraintName("FK_luggage_tag_color");
        });

        modelBuilder.Entity<VisitorBooth>(entity =>
        {
            entity.HasKey(e => new { e.VisitorId, e.BoothId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("visitor_booth");

            entity.HasIndex(e => e.BoothId, "FK_booth_visitor_booth_idx");

            entity.Property(e => e.VisitorId).HasColumnName("visitor_id");
            entity.Property(e => e.BoothId).HasColumnName("booth_id");
            entity.Property(e => e.DateVisited)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("date_visited");

            entity.HasOne(d => d.Booth).WithMany(p => p.VisitorBooths)
                .HasForeignKey(d => d.BoothId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_booth_visitor_booth");

            entity.HasOne(d => d.Visitor).WithMany(p => p.VisitorBooths)
                .HasForeignKey(d => d.VisitorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_visitor_visitor_ booth");
        });

        modelBuilder.Entity<VisitorWorkshop>(entity =>
        {
            entity.HasKey(e => new { e.VisitorId, e.WorkshopId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("visitor_workshop");

            entity.HasIndex(e => e.WorkshopId, "fk_workshop_visitor_workshop_idx");

            entity.Property(e => e.VisitorId).HasColumnName("visitor_id");
            entity.Property(e => e.WorkshopId).HasColumnName("workshop_id");
            entity.Property(e => e.DateCertificateSent)
                .HasColumnType("datetime")
                .HasColumnName("date_certificate_sent");
            entity.Property(e => e.DateCompleted)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("date_completed");

            entity.HasOne(d => d.Visitor).WithMany(p => p.VisitorWorkshops)
                .HasForeignKey(d => d.VisitorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_visitor_visitor_workshop");

            entity.HasOne(d => d.Workshop).WithMany(p => p.VisitorWorkshops)
                .HasForeignKey(d => d.WorkshopId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_workshop_visitor_workshop");
        });

        modelBuilder.Entity<Workshop>(entity =>
        {
            entity.HasKey(e => e.WorkshopId).HasName("PRIMARY");

            entity.ToTable("workshop");

            entity.Property(e => e.WorkshopId).HasColumnName("workshop_id");
            entity.Property(e => e.WorkshopDescription)
                .HasMaxLength(256)
                .HasColumnName("workshop_description");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
