package curriculum

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"learnquest-backend/internal/database"
	"learnquest-backend/internal/models"
)

var ingestKey string

func RegisterRoutes(r *gin.RouterGroup, ingestSecret string) {
	ingestKey = ingestSecret
	r.GET("/curriculum", getCurriculum)
	r.GET("/library", getLibrary)
	r.POST("/library/notes", ingestNote)
}

type subjectInfo struct {
	Name    string   `json:"name"`
	Classes []string `json:"classes"` // which classes actually take this subject
	Topics  []string `json:"topics"`
}

// TODO: replace this hardcoded structure with data from the curriculum
// import pipeline described in the project plan (built from official
// WAEC/NECO-aligned sources into this same shape). Topics below are
// sourced from real NERDC schemes of work and WAEC syllabi, not invented.
func getCurriculum(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"classes": []string{"JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"},
		"terms":   []string{"1st Term", "2nd Term", "3rd Term"},
		"subjects": []subjectInfo{
			{
				Name: "Physics", Classes: []string{"SS1", "SS2", "SS3"},
				Topics: []string{"Waves", "Electromagnetism", "Thermodynamics", "Optics"},
			},
			{
				Name: "Mathematics", Classes: []string{"JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"},
				Topics: []string{"Quadratic Equations", "Trigonometry", "Probability"},
			},
			{
				Name: "English Language", Classes: []string{"JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"},
				Topics: []string{"Clauses", "Comprehension", "Essay Writing"},
			},
			{
				Name: "Chemistry", Classes: []string{"SS1", "SS2", "SS3"},
				Topics: []string{"Periodic Table", "Chemical Bonding", "Acids & Bases"},
			},
			{
				Name: "Biology", Classes: []string{"SS1", "SS2", "SS3"},
				Topics: []string{"Cell Structure", "Genetics", "Ecology"},
			},
			{
				// Real WAEC Government syllabus topics.
				Name: "Government", Classes: []string{"SS1", "SS2", "SS3"},
				Topics: []string{
					"Meaning and Basic Concepts of Government",
					"The Nigerian Constitution",
					"Federalism and Revenue Allocation",
					"Local Government Administration",
					"Political Parties and Pressure Groups",
					"Nigeria's Foreign Policy",
				},
			},
			{
				// Real NERDC Basic Science and Technology scheme of work topics.
				Name: "Basic Science", Classes: []string{"JSS1", "JSS2", "JSS3"},
				Topics: []string{
					"Living and Non-Living Things",
					"Family Health and Sanitation",
					"Environmental Pollution",
					"Drug and Substance Abuse",
					"Soil Erosion and Flooding",
					"Depletion of the Ozone Layer",
				},
			},
			{
				// Civic Education is taught across both junior and senior
				// secondary — real NERDC/WAEC scheme of work topics.
				Name: "Civic Education", Classes: []string{"JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"},
				Topics: []string{
					"Meaning and Importance of Civic Education",
					"Citizenship and National Identity",
					"Human Rights and Child's Rights",
					"Democracy and Rule of Law",
					"Civic Participation and Community Service",
					"Corruption and Its Effects",
				},
			},

			// ---------- JSS core & elective subjects ----------
			{
				Name: "Social Studies", Classes: []string{"JSS1", "JSS2", "JSS3"},
				Topics: []string{
					"The Family and Community",
					"Culture and Values",
					"Population and Resources",
					"Nigeria as a Nation",
					"Social Problems (Drug Abuse, Corruption)",
					"Nigeria's Relationship with Other Countries",
				},
			},
			{
				Name: "Basic Technology", Classes: []string{"JSS1", "JSS2", "JSS3"},
				Topics: []string{
					"Introduction to Technology",
					"Tools and Machines",
					"Technical Drawing Basics",
					"Woodwork and Metalwork",
					"Electrical and Electronics Basics",
					"Safety in the Workshop",
				},
			},
			{
				Name: "Business Studies", Classes: []string{"JSS1", "JSS2", "JSS3"},
				Topics: []string{
					"Introduction to Business",
					"Keyboarding and Typewriting",
					"Office Practice",
					"Commerce and Trade",
					"Entrepreneurship Basics",
					"Bookkeeping Basics",
				},
			},
			{
				Name: "Agricultural Science", Classes: []string{"JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"},
				Topics: []string{
					"Introduction to Agriculture",
					"Farm Tools and Equipment",
					"Soil and Soil Fertility",
					"Crop Production",
					"Animal Husbandry Basics",
					"Agricultural Practices and the Environment",
				},
			},
			{
				Name: "Home Economics", Classes: []string{"JSS1", "JSS2", "JSS3"},
				Topics: []string{
					"Introduction to Home Economics",
					"Food and Nutrition",
					"Family Living",
					"Clothing and Textiles",
					"Home Management",
					"Consumer Education",
				},
			},
			{
				Name: "Computer Studies", Classes: []string{"JSS1", "JSS2", "JSS3"},
				Topics: []string{
					"Introduction to Computers",
					"Computer Hardware and Software",
					"The Keyboard and Mouse",
					"Basic Computer Operations",
					"Internet Basics",
					"Computer Ethics and Safety",
				},
			},
			{
				Name: "Cultural and Creative Arts", Classes: []string{"JSS1", "JSS2", "JSS3"},
				Topics: []string{
					"Introduction to Creative Arts",
					"Drawing and Painting",
					"Music and Dance",
					"Drama and Role Play",
					"Nigerian Arts and Crafts",
					"Design and Colour",
				},
			},
			{
				Name: "French", Classes: []string{"JSS1", "JSS2", "JSS3"},
				Topics: []string{
					"Greetings and Introductions",
					"Numbers and Colours",
					"Family Members",
					"Days, Months and Seasons",
					"Common Verbs and Simple Sentences",
					"Basic Conversations",
				},
			},

			// ---------- SS Science stream ----------
			{
				Name: "Further Mathematics", Classes: []string{"SS1", "SS2", "SS3"},
				Topics: []string{
					"Indices and Logarithms",
					"Sequences and Series",
					"Matrices",
					"Differentiation",
					"Integration",
					"Vectors",
				},
			},
			{
				Name: "Geography", Classes: []string{"SS1", "SS2", "SS3"},
				Topics: []string{
					"The Earth and Its Structure",
					"Weather and Climate",
					"Map Reading and Interpretation",
					"Population Studies",
					"Nigeria's Physical and Human Geography",
					"Environmental Issues",
				},
			},

			// ---------- SS Arts/Humanities stream ----------
			{
				Name: "Literature in English", Classes: []string{"SS1", "SS2", "SS3"},
				Topics: []string{
					"Elements of Prose",
					"Elements of Drama",
					"Elements of Poetry",
					"Figures of Speech",
					"Study of a Prescribed Prose Text",
					"Study of a Prescribed Drama Text",
				},
			},
			{
				Name: "History", Classes: []string{"SS1", "SS2", "SS3"},
				Topics: []string{
					"Pre-Colonial Nigerian Societies",
					"European Contact and Colonization",
					"The Nigerian Independence Movement",
					"Nigeria Since Independence",
					"The Transatlantic Slave Trade",
					"African Nationalism",
				},
			},

			// ---------- SS Commercial stream ----------
			{
				Name: "Economics", Classes: []string{"SS1", "SS2", "SS3"},
				Topics: []string{
					"Basic Economic Problems and Concepts",
					"Demand and Supply",
					"Money and Banking",
					"Population and Labour",
					"National Income",
					"International Trade",
				},
			},
			{
				Name: "Financial Accounting", Classes: []string{"SS1", "SS2", "SS3"},
				Topics: []string{
					"Introduction to Accounting",
					"The Accounting Equation",
					"Books of Original Entry",
					"The Trial Balance",
					"Trading, Profit and Loss Account",
					"The Balance Sheet",
				},
			},
			{
				Name: "Commerce", Classes: []string{"SS1", "SS2", "SS3"},
				Topics: []string{
					"Introduction to Commerce",
					"Trade and Its Classification",
					"Business Organizations",
					"Insurance",
					"Banking Services",
					"The Stock Exchange",
				},
			},

			// ---------- Religious studies (JSS + SS, both faiths) ----------
			{
				Name: "Christian Religious Studies", Classes: []string{"JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"},
				Topics: []string{
					"Creation and Early Old Testament Stories",
					"The Life and Teachings of Jesus Christ",
					"The Ten Commandments",
					"Parables of Jesus",
					"The Early Church",
					"Christian Values and Morality",
				},
			},
			{
				Name: "Islamic Studies", Classes: []string{"JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"},
				Topics: []string{
					"The Five Pillars of Islam",
					"The Life of Prophet Muhammad (SAW)",
					"Basic Tenets of Faith (Iman)",
					"Salah (Prayer) and Its Significance",
					"Islamic Moral Values",
					"Stories of the Prophets",
				},
			},
		},
	})
}

type noteOut struct {
	Title   string `json:"title"`
	Topic   string `json:"topic"`
	Content string `json:"content"`
}

type librarySubjectOut struct {
	Name  string    `json:"name"`
	Notes []noteOut `json:"notes"`
}

// GET /api/library — real, original study notes, grouped by subject.
// Nothing here links out; every note is read entirely inside the app.
// Starts with 3 seeded notes (see database.go) and grows as
// scripts/textbook_fetcher covers the rest of the curriculum.
func getLibrary(c *gin.Context) {
	var notes []models.LibraryNote
	database.DB.Order("subject, topic").Find(&notes)

	grouped := map[string][]noteOut{}
	var order []string
	for _, n := range notes {
		if _, ok := grouped[n.Subject]; !ok {
			order = append(order, n.Subject)
		}
		grouped[n.Subject] = append(grouped[n.Subject], noteOut{
			Title: n.Title, Topic: n.Topic, Content: n.Content,
		})
	}

	result := make([]librarySubjectOut, 0, len(order))
	for _, name := range order {
		result = append(result, librarySubjectOut{Name: name, Notes: grouped[name]})
	}
	c.JSON(http.StatusOK, result)
}

type ingestRequest struct {
	Subject string `json:"subject" binding:"required"`
	Topic   string `json:"topic" binding:"required"`
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

// POST /api/library/notes — called by scripts/textbook_fetcher, never by
// the frontend. Protected by a shared secret header, not user JWTs, since
// there's no logged-in user involved in this call.
func ingestNote(c *gin.Context) {
	if ingestKey == "" || c.GetHeader("X-Ingest-Key") != ingestKey {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or missing X-Ingest-Key"})
		return
	}

	var req ingestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Subject+Topic is unique — an existing note for this topic gets
	// updated in place rather than duplicated, so re-running the fetcher
	// (e.g. after improving the prompt) refreshes content instead of
	// piling up duplicates.
	var existing models.LibraryNote
	err := database.DB.Where("subject = ? AND topic = ?", req.Subject, req.Topic).First(&existing).Error
	if err == nil {
		existing.Title = req.Title
		existing.Content = req.Content
		database.DB.Save(&existing)
		c.JSON(http.StatusOK, gin.H{"message": "updated", "id": existing.ID})
		return
	}

	note := models.LibraryNote{
		Subject: req.Subject, Topic: req.Topic, Title: req.Title, Content: req.Content,
	}
	if err := database.DB.Create(&note).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not save note"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "added", "id": note.ID})
}
