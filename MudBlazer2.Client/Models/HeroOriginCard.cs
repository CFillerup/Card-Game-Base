namespace MudBlazer2.Client.Models
{
    public class HeroOriginCard : CardBase
    {
        public List<string> SpeciesOptions { get; set; }
        public Dictionary<string, string> AbilityDice { get; set; }
        public List<Ability> OriginAbilities { get; set; }
    }
}
