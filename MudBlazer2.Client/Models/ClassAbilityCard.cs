namespace MudBlazer2.Client.Models
{
    public abstract class ClassAbilityCard : CardBase
    {
        public HeroClassCard Class { get; set; }
        public int Tier { get; set; }
        public List<Ability> abilities { get; set; }
    }
}
