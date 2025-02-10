using System.Text.Json.Serialization;

namespace MudBlazer2.Client.Models
{
    public class ItemRequirement
    {
        public string Description { get; set; } = string.Empty; // Example: "Requires Str d8 or higher"

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public RequirementTypeEnum RequirementType { get; set; } // e.g., Ability, Class, Race

        public string Value { get; set; } = string.Empty; // Example: "Str d8+", "Voltari", "Chaplain"

    }
    public enum RequirementTypeEnum
    {
        Ability, // Requires a specific ability die size (e.g., Str d8+)
        Class,   // Requires a specific class
        Race,    // Requires a specific race
        Level,   // Requires a specific level
        Other    // Any other special condition
    }
}
