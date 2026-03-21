using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ABPGroup.CodeGen.Dto;

public class RefinementInputDto
{
    [Required]
    public string SessionId { get; set; }

    [Required]
    public string ChangeRequest { get; set; } // natural language description of what to change

    public List<string> AffectedFiles { get; set; } = new(); // optional hint about which files to touch
}