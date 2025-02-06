namespace MudBlazer2.Client.Models
{
    public class EncounterCard : CardBase
    {
        public List<CreatureCard> Creatures { get; set; }
        public string EncounterSetup { get; set; }
        public string CompletionRequirement { get; set; }
        public string Rewards { get; set; }
    }
}
