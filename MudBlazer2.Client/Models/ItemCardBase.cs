using System.Text.Json.Serialization;

namespace MudBlazer2.Client.Models
{
    public class ItemCardBase : CardBase
    {
        public enum ItemTypeEnum
        {
            Held,
            Armor,
            Accessory,
            Consumable,
            Relic
        }
        public enum ItemRarityEnum
        {
            Common,
            Rare,
            Epic,
            Legendary,
        }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ItemTypeEnum ItemType { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ItemRarityEnum Rarity { get; set; }
        public List<Ability> Abilities { get; set; } = new List<Ability>();

        public List<ItemRequirement> Requirements { get; set; } = new List<ItemRequirement>(); // Equip conditions

    }
}
