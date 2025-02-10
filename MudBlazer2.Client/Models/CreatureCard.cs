namespace MudBlazer2.Client.Models
{
    public class CreatureCard :CardBase
    {
        public string Size { get; set; } // Small, Medium, Large, Huge
        public string Type { get; set; } // Beast, Undead, Humanoid, Construct, etc.
        public int Tier { get; set; } // 1, 2, or 3
        public int Health { get; set; } // Average of Constitution dice
        public int Defense { get; set; } // Flat defense value
        public Dictionary<string, string> Attributes { get; set; } // Strength, Dex, etc.
        public List<Ability> Abilities { get; set; } // Standardized with hero abilities
        public string Behavior { get; set; } // Combat AI behavior
    }
}
