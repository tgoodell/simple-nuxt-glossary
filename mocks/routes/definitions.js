// Initial definition data
const DEFINITIONS = [
    {
      "term": "Frame",
      "definition": "The main structural component of the bicycle, usually made of metal (aluminum, steel, titanium, or carbon fiber) or sometimes of other materials like bamboo or wood."
    },
    {
      "term": "Fork",
      "definition": "The component that holds the front wheel and attaches it to the frame. It consists of two fork blades and a steerer tube."
    },
    {
      "term": "Handlebars",
      "definition": "The part of the bicycle that the rider holds onto for steering and control. Handlebars come in various shapes and styles, including flat bars, drop bars, and riser bars."
    },
    {
      "term": "Stem",
      "definition": "The component that connects the handlebars to the fork steerer tube. It determines the rider's reach and height."
    },
    {
      "term": "Headset",
      "definition": "The bearing assembly that allows the fork to rotate smoothly within the frame's head tube."
    },
    {
      "term": "Seatpost",
      "definition": "The tube that connects the saddle (seat) to the frame. It allows the rider to adjust the saddle height."
    },
    {
      "term": "Saddle",
      "definition": "The seat of the bicycle where the rider sits. Saddles come in different shapes and sizes for various riding styles and preferences."
    },
    {
      "term": "Wheels",
      "definition": "The circular components that allow the bicycle to roll. Each wheel consists of a rim, spokes, and a hub."
    },
    {
      "term": "Tires",
      "definition": "The rubber outer layer of the wheels that makes contact with the ground. Tires come in different sizes, treads, and materials for various riding conditions."
    },
    {
      "term": "Inner Tube",
      "definition": "The inflatable tube inside the tire that holds the air pressure."
    },
    {
      "term": "Brakes",
      "definition": "The mechanism used to slow down or stop the bicycle. Common types include rim brakes (caliper or V-brakes) and disc brakes (mechanical or hydraulic)."
    },
    {
      "term": "Shifters",
      "definition": "The controls used to change gears. They can be integrated into the brake levers (STI shifters), mounted separately on the handlebars (trigger shifters), or integrated into the grips (twist shifters)."
    },
    {
      "term": "Derailleurs",
      "definition": "The mechanisms responsible for moving the chain between different gears on the cassette or freewheel."
    },
    {
      "term": "Chain",
      "definition": "The metal linkages that transfer power from the pedals to the rear wheel."
    },
    {
      "term": "Crankset",
      "definition": "The assembly that includes the crank arms, chainrings, and bottom bracket. It converts the rider's pedaling motion into rotational motion."
    },
    {
      "term": "Pedals",
      "definition": "The components that the rider's feet rest on and push against to propel the bicycle forward. Pedals can come in various styles, including platform pedals, clipless pedals, and toe clip pedals."
    },
    {
      "term": "Bottom Bracket",
      "definition": "The bearing assembly that allows the crankset to rotate smoothly within the frame."
    },
    {
      "term": "Cassette/Freewheel",
      "definition": "The cluster of sprockets mounted on the rear wheel hub. It provides multiple gear ratios for different riding conditions."
    },
    {
      "term": "Shift Cables/Housing",
      "definition": "The cables and housing that connect the shifters to the derailleurs, allowing the rider to change gears."
    },
    {
      "term": "Brake Cables/Housing",
      "definition": "The cables and housing that connect the brake levers to the brakes, allowing the rider to apply braking force."
    }
  ]

  module.exports = [
    {
        id: "get-terms", // route id
        url: "/api/glossary", // url in express format
        method: "GET", // HTTP method
        variants: [
            {
                id: "success", // variant id
                type: "json", // variant handler id
                options: {
                    status: 200, // status to send
                    body: DEFINITIONS, // body to send
                },
            },
        ]
    }
  ]