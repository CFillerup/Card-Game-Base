namespace MudBlazer2.Client.Models
{
    public class HeroClassCard : CardBase
    {
        public Dictionary<string, string> DiceModifications { get; set; }
        public string PrimaryDice { get; set; }
        public string SecondaryDice { get; set; }
        public List<Ability> ClassAbilities { get; set; }
        public List<ClassAbilityCard> AbilityDeck { get; set; }
    }
}
