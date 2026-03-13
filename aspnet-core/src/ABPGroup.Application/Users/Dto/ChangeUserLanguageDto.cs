using System.ComponentModel.DataAnnotations;

namespace ABPGroup.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}