using static MudBlazer2.Client.Models.ItemCardBase;
using System.Text.Json.Serialization;

namespace MudBlazer2.Client.Models
{
    public class ArmorItem : ItemCardBase
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ArmorSubtypeEnum Subtype { get; set; }

        public int DefenseBonus { get; set; } = 0; // Flat bonus to defense rolls

        public ArmorItem()
        {
            ItemType = ItemTypeEnum.Armor;
        }
    }
    public enum ArmorSubtypeEnum
    {
        Helm,
        Chest,
        Boots
    }
}
