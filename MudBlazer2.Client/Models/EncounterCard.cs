namespace MudBlazer2.Client.Models
{
    public class EncounterCard : CardBase
    {
        public Dictionary<string, string> Creatures { get; set; }
        public string EncounterSetup { get; set; }
        public Dictionary<string, string> RequirementAndRewards { get; set; }
    }
}
