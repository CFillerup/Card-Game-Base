namespace MudBlazer2.Client.Models
{
    public class CreatureCard :CardBase
    {
        public string Species { get; set; }
        public string Size { get; set; }
        public string Ammount { get; set; } = "1";
        public Dictionary<string, string> AbilityDice { get; set; }
        public string Disposition { get; set; }
        public string Tactics { get; set; }
        public List<Ability> CreatureAbilities { get; set; }
    }
}
