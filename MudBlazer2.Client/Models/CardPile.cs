namespace MudBlazer2.Client.Models
{
    public class CardPile
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public string Description { get; set; }
        public List<CardBase> Cards { get; set; }
        public string Identifier { get; set; }
        public bool CanCycle { get; set; }
        public bool CanMove { get; set; }
        public bool IsSnapping { get; set; }
        public int Rotation { get; set; } = 0; // Store rotation angle
        public bool NewCard { get; set; } = false;
        public Position StartingPosition { get; set; } = new Position();
    }
}
