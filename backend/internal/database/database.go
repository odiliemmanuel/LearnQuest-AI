package database

import (
	"log"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"

	"learnquest-backend/internal/models"
)

var DB *gorm.DB

// Connect opens (or creates) a local SQLite file — no separate database
// server needed. Swap this driver for postgres later without changing
// any handler code, since GORM's query API stays the same.
func Connect() {
	db, err := gorm.Open(sqlite.Open("learnquest.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect to database: ", err)
	}

	if err := db.AutoMigrate(&models.User{}, &models.Question{}, &models.TheoryQuestion{}, &models.Attempt{}, &models.LibraryNote{}); err != nil {
		log.Fatal("failed to migrate database: ", err)
	}

	DB = db
	seed()
}

func seed() {
	var count int64
	DB.Model(&models.Question{}).Count(&count)
	if count > 0 {
		return // already seeded
	}

	questions := []models.Question{
		{
			Subject: "Physics", Topic: "Waves", ClassLevel: "SS2",
			Text:            "What happens to wave speed when frequency increases and wavelength stays constant?",
			OptionA:         "Wave speed increases",
			OptionB:         "Wave speed decreases",
			OptionC:         "Wave speed stays the same",
			OptionD:         "Wave speed becomes zero",
			Correct:         "A",
			FeedbackCorrect: "Correct! Since v = fλ, if wavelength (λ) stays the same and frequency (f) rises, speed (v) must rise too.",
			FeedbackWrong:   "Not quite. Remember v = fλ. If wavelength stays constant and frequency goes up, speed must go up too — try that formula again.",
		},
		{
			Subject: "Physics", Topic: "Waves", ClassLevel: "SS2",
			Text:            "A wave has a frequency of 50 Hz and a wavelength of 4 m. What is its speed?",
			OptionA:         "12.5 m/s",
			OptionB:         "54 m/s",
			OptionC:         "200 m/s",
			OptionD:         "46 m/s",
			Correct:         "C",
			FeedbackCorrect: "Correct! v = fλ = 50 × 4 = 200 m/s.",
			FeedbackWrong:   "Use v = fλ. That's 50 Hz × 4 m = 200 m/s — multiply the two values, don't add or divide them.",
		},
		{
			Subject: "Physics", Topic: "Waves", ClassLevel: "SS2",
			Text:            "Which type of wave requires a medium to travel through?",
			OptionA:         "Light waves",
			OptionB:         "Radio waves",
			OptionC:         "Sound waves",
			OptionD:         "X-rays",
			Correct:         "C",
			FeedbackCorrect: "Correct! Sound is a mechanical wave — it needs particles (air, water, solids) to travel through.",
			FeedbackWrong:   "Think mechanical vs. electromagnetic waves. Sound needs a medium; light, radio, and X-rays don't.",
		},
		{
			Subject: "Physics", Topic: "Waves", ClassLevel: "SS2",
			Text:            "What is the distance between two successive crests of a wave called?",
			OptionA:         "Amplitude",
			OptionB:         "Wavelength",
			OptionC:         "Frequency",
			OptionD:         "Period",
			Correct:         "B",
			FeedbackCorrect: "Correct! Wavelength (λ) is the distance between two matching points on consecutive waves.",
			FeedbackWrong:   "Amplitude is height, frequency is how often, period is how long one cycle takes. The distance between two crests is wavelength.",
		},
		{
			Subject: "Physics", Topic: "Waves", ClassLevel: "SS2",
			Text:            "As a wave's amplitude increases, what happens to the energy it carries?",
			OptionA:         "Energy decreases",
			OptionB:         "Energy stays the same",
			OptionC:         "Energy increases",
			OptionD:         "Energy becomes negative",
			Correct:         "C",
			FeedbackCorrect: "Correct! Higher amplitude means the wave carries more energy — that's why louder sounds have bigger amplitude.",
			FeedbackWrong:   "Bigger amplitude always means more energy, not less. Think of a small ripple vs. a big ocean wave.",
		},

		// Basic Science — Living and Non-Living Things (JSS)
		{
			Subject: "Basic Science", Topic: "Living and Non-Living Things", ClassLevel: "JSS1",
			Text:            "Which of the following is a characteristic shared by all living things?",
			OptionA:         "Ability to fly",
			OptionB:         "Ability to reproduce",
			OptionC:         "Having leaves",
			OptionD:         "Being made of metal",
			Correct:         "B",
			FeedbackCorrect: "Correct! Reproduction — producing new individuals of the same kind — is one of the key characteristics every living thing shares.",
			FeedbackWrong:   "Not every living thing can fly or has leaves. The one true shared characteristic here is the ability to reproduce.",
		},
		{
			Subject: "Basic Science", Topic: "Living and Non-Living Things", ClassLevel: "JSS1",
			Text:            "Which of these is a non-living thing?",
			OptionA:         "Tree",
			OptionB:         "Rock",
			OptionC:         "Fish",
			OptionD:         "Mushroom",
			Correct:         "B",
			FeedbackCorrect: "Correct! A rock does not grow, reproduce, or respire — it has none of the characteristics of living things.",
			FeedbackWrong:   "Trees, fish, and mushrooms all grow and reproduce. A rock does none of these — it's the non-living one.",
		},
		{
			Subject: "Basic Science", Topic: "Living and Non-Living Things", ClassLevel: "JSS1",
			Text:            "What is the process by which living things get rid of waste products called?",
			OptionA:         "Respiration",
			OptionB:         "Excretion",
			OptionC:         "Nutrition",
			OptionD:         "Growth",
			Correct:         "B",
			FeedbackCorrect: "Correct! Excretion is specifically the removal of waste products made by the body.",
			FeedbackWrong:   "Respiration is breathing/releasing energy, nutrition is feeding, growth is increasing in size — waste removal is excretion.",
		},
		{
			Subject: "Basic Science", Topic: "Living and Non-Living Things", ClassLevel: "JSS1",
			Text:            "Which characteristic of living things allows them to respond to changes in their surroundings?",
			OptionA:         "Irritability",
			OptionB:         "Excretion",
			OptionC:         "Reproduction",
			OptionD:         "Respiration",
			Correct:         "A",
			FeedbackCorrect: "Correct! Irritability (also called sensitivity) is the ability to detect and respond to changes in the environment.",
			FeedbackWrong:   "That's the definition of irritability/sensitivity specifically — not excretion, reproduction, or respiration.",
		},
		{
			Subject: "Basic Science", Topic: "Living and Non-Living Things", ClassLevel: "JSS1",
			Text:            "Which of the following is NOT one of the characteristics of living things?",
			OptionA:         "Growth",
			OptionB:         "Movement",
			OptionC:         "Combustion",
			OptionD:         "Reproduction",
			Correct:         "C",
			FeedbackCorrect: "Correct! Combustion (burning) is a chemical process, not a characteristic of living things — growth, movement, and reproduction are.",
			FeedbackWrong:   "Growth, movement, and reproduction are all real characteristics of living things. Combustion is the odd one out — it's just burning.",
		},

		// Government — The Nigerian Constitution (SS)
		{
			Subject: "Government", Topic: "The Nigerian Constitution", ClassLevel: "SS1",
			Text:            "What is a constitution?",
			OptionA:         "A set of laws made by a single person",
			OptionB:         "The supreme law that guides the government of a country",
			OptionC:         "A book of history",
			OptionD:         "A political party manifesto",
			Correct:         "B",
			FeedbackCorrect: "Correct! A constitution is the supreme law of a country — every other law must comply with it.",
			FeedbackWrong:   "A constitution isn't made by one person, isn't a history book, and isn't a party manifesto — it's the supreme law guiding government.",
		},
		{
			Subject: "Government", Topic: "The Nigerian Constitution", ClassLevel: "SS1",
			Text:            "Which of these is a key feature of a written constitution?",
			OptionA:         "It exists only in the minds of the rulers",
			OptionB:         "It is documented and can be referred to",
			OptionC:         "It changes automatically every year",
			OptionD:         "It has no legal authority",
			Correct:         "B",
			FeedbackCorrect: "Correct! A written constitution is formally documented, so citizens and courts can refer to its exact wording.",
			FeedbackWrong:   "The defining feature of a WRITTEN constitution is that it's documented — not unwritten, not automatically changing, and it does carry legal authority.",
		},
		{
			Subject: "Government", Topic: "The Nigerian Constitution", ClassLevel: "SS1",
			Text:            "Nigeria's current constitution, adopted at the return to civilian rule, is commonly known as what?",
			OptionA:         "The 1979 Constitution",
			OptionB:         "The 1999 Constitution",
			OptionC:         "The 1963 Constitution",
			OptionD:         "The 2007 Constitution",
			Correct:         "B",
			FeedbackCorrect: "Correct! The 1999 Constitution (as amended) has governed Nigeria since the return to civilian rule that year.",
			FeedbackWrong:   "Nigeria has had several constitutions historically, but the one currently in force is the 1999 Constitution.",
		},
		{
			Subject: "Government", Topic: "The Nigerian Constitution", ClassLevel: "SS1",
			Text:            "What is the term for changing or adding to a section of the constitution?",
			OptionA:         "Amendment",
			OptionB:         "Abolition",
			OptionC:         "Ratification",
			OptionD:         "Dissolution",
			Correct:         "A",
			FeedbackCorrect: "Correct! Amendment is the formal process of altering or adding to an existing constitution.",
			FeedbackWrong:   "Abolition means ending something entirely, ratification means formally approving, dissolution means disbanding — altering the constitution is an amendment.",
		},
		{
			Subject: "Government", Topic: "The Nigerian Constitution", ClassLevel: "SS1",
			Text:            "Which arm of government is primarily responsible for interpreting the constitution?",
			OptionA:         "The Executive",
			OptionB:         "The Legislature",
			OptionC:         "The Judiciary",
			OptionD:         "The Civil Service",
			Correct:         "C",
			FeedbackCorrect: "Correct! The Judiciary (the courts) interprets the constitution and resolves disputes about what it means.",
			FeedbackWrong:   "The Executive implements laws and the Legislature makes them — it's the Judiciary that interprets what the constitution means.",
		},

		// Civic Education — Human Rights and Child's Rights (JSS/SS)
		{
			Subject: "Civic Education", Topic: "Human Rights and Child's Rights", ClassLevel: "SS1",
			Text:            "What are human rights?",
			OptionA:         "Rights given only to adults",
			OptionB:         "Basic rights and freedoms that belong to every person",
			OptionC:         "Rights that only citizens of rich countries have",
			OptionD:         "Privileges the government can freely withdraw at any time",
			Correct:         "B",
			FeedbackCorrect: "Correct! Human rights are basic freedoms and protections every person is entitled to, simply by being human.",
			FeedbackWrong:   "Human rights aren't limited to adults, wealthy countries, or government favor — they belong to every person, everywhere.",
		},
		{
			Subject: "Civic Education", Topic: "Human Rights and Child's Rights", ClassLevel: "SS1",
			Text:            "Which document is widely recognized as declaring the basic rights every human being is entitled to?",
			OptionA:         "The Universal Declaration of Human Rights",
			OptionB:         "The Constitution of the United States",
			OptionC:         "The United Nations Charter",
			OptionD:         "The Geneva Convention",
			Correct:         "A",
			FeedbackCorrect: "Correct! The Universal Declaration of Human Rights (UDHR), adopted by the UN in 1948, is the foundational document for human rights worldwide.",
			FeedbackWrong:   "Those are all real documents, but the one specifically declaring universal human rights is the Universal Declaration of Human Rights.",
		},
		{
			Subject: "Civic Education", Topic: "Human Rights and Child's Rights", ClassLevel: "SS1",
			Text:            "In Nigeria, which act protects the rights of children?",
			OptionA:         "The Electoral Act",
			OptionB:         "The Child's Rights Act",
			OptionC:         "The Penal Code",
			OptionD:         "The Companies Act",
			Correct:         "B",
			FeedbackCorrect: "Correct! The Child's Rights Act (2003) is Nigeria's law specifically protecting the rights and welfare of children.",
			FeedbackWrong:   "Those other acts cover elections, crimes, and companies — the one for children specifically is the Child's Rights Act.",
		},
		{
			Subject: "Civic Education", Topic: "Human Rights and Child's Rights", ClassLevel: "SS1",
			Text:            "Which of the following is an example of a child's right?",
			OptionA:         "The right to vote in elections",
			OptionB:         "The right to education",
			OptionC:         "The right to own property",
			OptionD:         "The right to run for public office",
			Correct:         "B",
			FeedbackCorrect: "Correct! The right to education is a core child's right — the other options only apply to adults under Nigerian law.",
			FeedbackWrong:   "Voting, owning property, and running for office all require adult status. Education is the right that specifically belongs to children.",
		},
		{
			Subject: "Civic Education", Topic: "Human Rights and Child's Rights", ClassLevel: "SS1",
			Text:            "Why is it important to protect human rights?",
			OptionA:         "To favor only the wealthy",
			OptionB:         "To ensure dignity, fairness, and justice for all people",
			OptionC:         "To give power only to the government",
			OptionD:         "To restrict freedom of speech",
			Correct:         "B",
			FeedbackCorrect: "Correct! Protecting human rights ensures every person is treated with dignity, fairness, and justice, regardless of their status.",
			FeedbackWrong:   "Protecting rights isn't about favoring the wealthy, empowering only government, or restricting speech — it's about dignity and fairness for everyone.",
		},
	}
	DB.Create(&questions)

	theoryQuestions := []models.TheoryQuestion{
		{
			Subject:   "Physics",
			Topic:     "Waves",
			Prompt:    "State the relationship between wave speed, frequency, and wavelength, and use it to calculate the speed of a wave with frequency 25 Hz and wavelength 2 m.",
			KeyPoints: "v = fλ,25,2,50",
		},
		{
			Subject:   "Physics",
			Topic:     "Waves",
			Prompt:    "Explain why sound cannot travel through a vacuum, but light can.",
			KeyPoints: "mechanical,medium,electromagnetic,vacuum",
		},
		{
			Subject:   "Basic Science",
			Topic:     "Living and Non-Living Things",
			Prompt:    "State three characteristics of living things and explain how they help distinguish a living thing from a non-living thing.",
			KeyPoints: "growth,reproduction,respiration,excretion,irritability,movement",
		},
		{
			Subject:   "Government",
			Topic:     "The Nigerian Constitution",
			Prompt:    "Explain what a constitution is and state one function it performs for a country like Nigeria.",
			KeyPoints: "supreme law,rules,government,rights,amend",
		},
		{
			Subject:   "Civic Education",
			Topic:     "Human Rights and Child's Rights",
			Prompt:    "State two rights of a child and explain why child's rights need special protection.",
			KeyPoints: "education,protection,health,vulnerable,Child's Rights Act",
		},
	}
	DB.Create(&theoryQuestions)

	log.Println("Database seeded with sample Physics · Waves content")

	seedLibraryNotes()
}

func seedLibraryNotes() {
	// Checked per-note (subject+topic), not "does the table have any rows
	// at all" — that earlier version meant any seed notes added after the
	// very first run would silently never get inserted, since the table
	// was already non-empty. This way, restarting after adding more seed
	// content actually adds what's missing instead of a no-op.

	// Original condensed study notes, written for LearnQuest — not copied
	// from any existing book. scripts/textbook_fetcher writes more of these
	// automatically as it covers the rest of the curriculum, the same way.
	notes := []models.LibraryNote{
		{
			Subject: "Physics", Topic: "Waves", Title: "Waves — Key Concepts and the Wave Equation",
			Content: `A wave carries energy from one place to another without carrying matter along with it. Every wave has four properties you need to know: amplitude (the height of the wave from its resting position, which determines how much energy it carries), wavelength — written as the Greek letter λ (the distance between two identical points on the wave, such as crest to crest), frequency — written as f (how many complete waves pass a point every second, measured in Hertz), and period — written as T (the time taken for one complete wave, and always equal to 1/f).

Waves fall into two broad types. Mechanical waves, like sound and water waves, need a medium — particles of air, water, or a solid — to travel through, because they work by making those particles vibrate. Electromagnetic waves, like light and radio waves, need no medium at all and can travel through empty space.

The single most useful formula for this topic is the wave equation: v = fλ, where v is the wave's speed. It tells you that speed depends only on frequency and wavelength — if one goes up and the other is held constant, speed goes up too.

Worked example: A wave has a frequency of 50 Hz and a wavelength of 4 m. Its speed is v = fλ = 50 × 4 = 200 m/s.

WAEC/NECO tip: examiners often give you two of the three values (v, f, λ) and ask for the third — always start by writing down v = fλ, then rearrange before substituting numbers.`,
		},
		{
			Subject: "Biology", Topic: "Cell Structure", Title: "Cell Structure — The Building Blocks of Life",
			Content: `Every living thing is made of cells — some organisms are a single cell, others (like humans) are made of trillions working together. There are two broad categories relevant at this level: plant cells and animal cells, which share several structures but differ in a few important ways.

Structures found in both plant and animal cells include the cell membrane (a thin boundary controlling what enters and leaves the cell), the cytoplasm (a jelly-like substance where chemical reactions happen), the nucleus (the control center, containing DNA that directs the cell's activities), mitochondria (where respiration releases energy from food — often called the "powerhouse of the cell"), and ribosomes (where proteins are made).

Plant cells have three extra structures animal cells lack: a rigid cell wall made of cellulose (giving the cell a fixed shape and support), chloroplasts (where photosynthesis happens, using sunlight to make food), and a large central vacuole (which stores water and helps keep the cell firm).

A simple way to remember the difference: plant cells are shaped like a box (because of the cell wall) while animal cells are typically rounder and more irregular, since they only have the flexible cell membrane holding them together.

WAEC/NECO tip: a very common question style is "state two differences between a plant cell and an animal cell" — cell wall and chloroplasts are the two safest, most specific answers to give.`,
		},
		{
			Subject: "Mathematics", Topic: "Trigonometry", Title: "Trigonometry — Introduction to Sine, Cosine and Tangent",
			Content: `Trigonometry is about the relationship between the angles and sides of a right-angled triangle. In any right-angled triangle, the longest side (opposite the right angle) is called the hypotenuse. For any other angle you pick in the triangle, the side directly across from it is called the opposite, and the remaining side next to that angle is called the adjacent.

The three basic ratios you need are usually remembered using the word SOHCAHTOA:
— Sine: sin(angle) = Opposite / Hypotenuse
— Cosine: cos(angle) = Adjacent / Hypotenuse
— Tangent: tan(angle) = Opposite / Adjacent

Worked example: In a right-angled triangle, the side opposite a 30° angle is 5 cm and the hypotenuse is 10 cm. Check: sin(30°) = 5/10 = 0.5, which matches the known value of sin(30°) — confirming the triangle's measurements are consistent.

These ratios let you find a missing side if you know one side and one angle, or find a missing angle if you know two sides (using the inverse functions sin⁻¹, cos⁻¹, tan⁻¹).

WAEC/NECO tip: always redraw the triangle and label opposite/adjacent/hypotenuse relative to the specific angle the question asks about — the same side can be "opposite" for one angle and "adjacent" for another.`,
		},
		{
			Subject: "Basic Science", Topic: "Living and Non-Living Things", Title: "Living and Non-Living Things — Characteristics of Life",
			Content: `Everything around us can be sorted into two groups: living things and non-living things. Living things are organisms that carry out life processes — they are born, they grow, and eventually they die. Non-living things, like a stone, a chair, or a bottle of water, do none of this on their own.

There are seven characteristics that, together, define a living thing. Growth means increasing permanently in size. Reproduction means producing new individuals of the same kind, so the species continues. Respiration is the process of releasing energy from food, usually using oxygen. Excretion is getting rid of waste products the body produces. Nutrition (or feeding) is taking in and using food for energy and growth. Movement is a change in position of the whole organism or part of it. Irritability (or sensitivity) is the ability to detect and respond to changes in the surroundings — like a plant's leaves turning toward sunlight.

A common exam trick is a one-off characteristic that looks biological but isn't — for example, a toy robot that "moves" is still non-living, because it can't reproduce, grow, or feed itself; it only does what it's programmed or powered to do.

WAEC/NECO tip: if a question asks you to prove something is alive, don't rely on just one characteristic — mention at least two or three (for example, growth and reproduction) since a single shared trait isn't always conclusive.`,
		},
		{
			Subject: "Government", Topic: "The Nigerian Constitution", Title: "The Nigerian Constitution — Meaning and Functions",
			Content: `A constitution is the supreme law of a country — a set of rules that establishes how a country is governed, defines the powers and limits of government, and protects the rights of citizens. Every other law made in the country must agree with the constitution; if any law conflicts with it, that law is invalid.

Nigeria has had several constitutions throughout its history, reflecting changes in how the country has been governed — from colonial-era constitutions through military rule to civilian governance. The constitution currently in force is the 1999 Constitution (as amended), adopted when Nigeria returned to civilian, democratic rule that year.

A constitution typically performs several functions: it establishes the structure of government (the executive, legislature, and judiciary, and how they relate to one another), it defines citizens' fundamental rights (such as freedom of speech and freedom of movement), it sets out how leaders are elected and how power is transferred, and it provides a process — called an amendment — for updating itself over time as the country's needs change.

The judiciary (the court system) plays a key role in interpreting the constitution — when there's a dispute about what a section of the constitution actually means or whether a law conflicts with it, it's ultimately the courts that decide.

WAEC/NECO tip: examiners often ask you to "state the functions of a constitution" — structure of government, protection of rights, and provision for amendment are three safe, specific points to include.`,
		},
		{
			Subject: "Civic Education", Topic: "Human Rights and Child's Rights", Title: "Human Rights and Child's Rights — What They Are and Why They Matter",
			Content: `Human rights are the basic freedoms and protections that belong to every person simply because they are human — regardless of nationality, gender, religion, or any other status. Nobody has to earn them, and in principle no government has the power to take them away entirely. Examples include the right to life, freedom from torture, freedom of speech, and the right to a fair hearing.

The most widely recognized statement of these rights is the Universal Declaration of Human Rights (UDHR), adopted by the United Nations in 1948, which sets out a common standard that countries around the world are expected to uphold.

Children, because they are still developing and are more vulnerable than adults, are recognized as needing additional, specific protections beyond general human rights. In Nigeria, this is formalized in the Child's Rights Act (2003), which guarantees things like the right to education, the right to health care, the right to be protected from abuse and exploitation, and the right to leisure and play. Importantly, some rights that apply to adults — like voting or owning property independently — don't apply to children, precisely because children need protection and guidance rather than full independence.

Protecting human rights and child's rights matters because it ensures every person, especially the most vulnerable, is treated with dignity, fairness, and justice — the foundation of a stable, functioning society.

WAEC/NECO tip: when asked to "state rights of the child," pick specific, well-known ones — education, health care, and protection from abuse are reliable, textbook-safe answers.`,
		},
	}

	added := 0
	for _, n := range notes {
		var existing models.LibraryNote
		err := DB.Where("subject = ? AND topic = ?", n.Subject, n.Topic).First(&existing).Error
		if err != nil { // not found — safe to insert
			DB.Create(&n)
			added++
		}
	}
	if added > 0 {
		log.Printf("Library: added %d missing starter note(s) — run scripts/textbook_fetcher for the rest\n", added)
	}
}
