namespace MudBlazer2.Client.Models
{
    public abstract class ItemCard : CardBase
    {
        public enum ItemTypeEnum
        {
            Weapon,
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
        public ItemTypeEnum ItemType { get; set; }
        public ItemRarityEnum ItemRarity { get; set; }
        public List<string> UsableByClasses { get; set; }
        public List<Ability> ItemAbilities { get; set; }
    }
}
