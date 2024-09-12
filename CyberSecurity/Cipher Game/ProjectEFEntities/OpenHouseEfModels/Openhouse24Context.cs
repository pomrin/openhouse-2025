using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ProjectEFEntities.OpenHouseEfModels;

public partial class Openhouse24Context : DbContext
{
    public Openhouse24Context()
    {
    }

    public Openhouse24Context(DbContextOptions<Openhouse24Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Code> Codes { get; set; }

    public virtual DbSet<Highscore> Highscores { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=docfiledb-t2.cxljlbpdqrxq.ap-southeast-1.rds.amazonaws.com,3306;user id=dotnetdev01;password=Dotnetdev@123;persist security info=True;database=openhouse24", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.33-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Code>(entity =>
        {
            entity.HasKey(e => e.Codes).HasName("PRIMARY");

            entity.ToTable("codes");

            entity.Property(e => e.Codes)
                .HasMaxLength(128)
                .HasColumnName("codes");
            entity.Property(e => e.Datecreated)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("datecreated");
            entity.Property(e => e.Updated)
                .HasMaxLength(45)
                .HasColumnName("updated");
        });

        modelBuilder.Entity<Highscore>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("highscore");

            entity.HasIndex(e => e.Codes, "FK_CODES_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Answer)
                .HasMaxLength(128)
                .HasColumnName("answer");
            entity.Property(e => e.Codes)
                .HasMaxLength(128)
                .HasColumnName("codes");
            entity.Property(e => e.Datecreated)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("datecreated");
            entity.Property(e => e.Timetaken)
                .HasComment("Time taken in seconds")
                .HasColumnName("timetaken");
            entity.Property(e => e.Username)
                .HasMaxLength(255)
                .HasColumnName("username")
                .UseCollation("utf8mb4_general_ci")
                .HasCharSet("utf8mb4");

            entity.HasOne(d => d.CodesNavigation).WithMany(p => p.Highscores)
                .HasForeignKey(d => d.Codes)
                .HasConstraintName("FK_CODES");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
