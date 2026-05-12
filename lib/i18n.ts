export type Language = "de" | "en";

export const translations = {
  de: {
    welcome: {
      title: "Willkommen, ich bin der Chatbot der DGUV.",
      description:
        "Mein Wissen basiert auf der Expertise der Deutschen Gesetzlichen Unfallversicherung. Ich beantworte Ihre Fragen zu Arbeitsschutz, Unfallverhütung und gesetzlicher Unfallversicherung.",
      note: "Bitte beachten Sie:",
      noteDetail:
        "Ich bin ein KI-Assistent und kann Fehler machen. Für verbindliche Auskünfte wenden Sie sich bitte direkt an Ihre zuständige Berufsgenossenschaft.",
      startButton: "Dialog starten",
      terms: "Nutzungsbedingungen",
      privacy: "Datenschutz",
    },
    chat: {
      placeholder: "Stellen Sie mir eine Frage.",
      send: "Senden",
      startRecording: "Sprachaufnahme starten",
      stopRecording: "Aufnahme stoppen",
      audioReceived: "Ihre Sprachnachricht wurde empfangen. Vielen Dank!",
      connectionError: "Fehler bei der Verbindung zum Server.",
      feedback: "Feedback geben",
    },
  },
  en: {
    welcome: {
      title: "Welcome, I am the DGUV chatbot.",
      description:
        "My knowledge is based on the expertise of the German Social Accident Insurance. I answer your questions about occupational safety, accident prevention and statutory accident insurance.",
      note: "Please note:",
      noteDetail:
        "I am an AI assistant and can make mistakes. For binding information, please contact your responsible trade association directly.",
      startButton: "Start dialogue",
      terms: "Terms of use",
      privacy: "Privacy policy",
    },
    chat: {
      placeholder: "Ask me a question.",
      send: "Send",
      startRecording: "Start voice recording",
      stopRecording: "Stop recording",
      audioReceived: "Your voice message has been received. Thank you!",
      connectionError: "Error connecting to the server.",
      feedback: "Give feedback",
    },
  },
} as const;

export type Translations = {
  welcome: {
    title: string;
    description: string;
    note: string;
    noteDetail: string;
    startButton: string;
    terms: string;
    privacy: string;
  };
  chat: {
    placeholder: string;
    send: string;
    startRecording: string;
    stopRecording: string;
    audioReceived: string;
    connectionError: string;
    feedback: string;
  };
};
