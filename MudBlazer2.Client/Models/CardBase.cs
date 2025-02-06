using System.Text.Json.Serialization;

namespace MudBlazer2.Client.Models
{
    public class CardBase
    {
        public string Name { get; set; }
        public string CardBack { get; set; }
        public string Description { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public CardTypeEnum CardType { get; set; }

        public enum CardTypeEnum
        {
            ClassAbility,
            Creature,
            Encounter,
            HeroClass,
            HeroOrigin,
            Item,
            Room
        }
        //public bool FaceUp { get; set; } 
    }
    //public bool FaceUp { get; set; } 
}
