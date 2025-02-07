using System.Text.Json.Serialization;

namespace MudBlazer2.Client.Models
{
    public class Ability
    {
        public string Name { get; set; }
        public string Effect { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public AbilityTypeEnum AbilityType { get; set; }
    }

    public enum AbilityTypeEnum
    {
        Action,
        Passive,
        Reaction,
        Consumable
    }
}
