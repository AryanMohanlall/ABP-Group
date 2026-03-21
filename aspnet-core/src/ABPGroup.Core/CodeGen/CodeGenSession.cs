using Abp.Domain.Entities;
using System;

namespace ABPGroup.CodeGen;

public class CodeGenSession : Entity<Guid>
{
    public long? UserId { get; set; }
    public long? ProjectId { get; set; }
    public string ProjectName { get; set; }
    public string Prompt { get; set; }
    public string NormalizedRequirement { get; set; }
    public string DetectedFeaturesJson { get; set; }
    public string DetectedEntitiesJson { get; set; }
    public string ConfirmedStackJson { get; set; }
    public string SpecJson { get; set; }
    public DateTime? SpecConfirmedAt { get; set; }
    public DateTime? GenerationStartedAt { get; set; }
    public DateTime? GenerationCompletedAt { get; set; }
    public int Status { get; set; }
    public string ValidationResultsJson { get; set; }
    public string ScaffoldTemplate { get; set; }
    public string GeneratedFilesJson { get; set; }
    public int RepairAttempts { get; set; }
    public string CurrentPhase { get; set; }
    public string CompletedStepsJson { get; set; }
    public string ErrorMessage { get; set; }
    public bool IsPublic { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // NEW: Generation mode tracking
    public string GenerationMode { get; set; } // "full" | "refinement" | "repair"
    public string RefinementHistoryJson { get; set; } // JSON array of past refinements
}
