using System.Text.Json.Serialization;

namespace MudBlazer2.Client.Models
{
    public class HeldItem : ItemCardBase
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public HeldItemSubtypeEnum Subtype { get; set; }

        public string AttackRoll { get; set; } = string.Empty; // Example: "1d8 + 2"

        public bool TwoHanded { get; set; } = false; // Determines if it takes up both weapon slots

         // Special effects/abilities

        public HeldItem()
        {
            ItemType = ItemTypeEnum.Held;
        }
    }
    public enum HeldItemSubtypeEnum
    {
        Melee,
        Ranged,
        Magic,
        OffHand
    }
}
