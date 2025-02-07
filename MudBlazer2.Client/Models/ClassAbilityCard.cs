namespace MudBlazer2.Client.Models
{
    public class ClassAbilityCard : CardBase
    {
        public string Class { get; set; }
        public int Tier { get; set; }
        public List<Ability> abilities { get; set; }
    }
}
