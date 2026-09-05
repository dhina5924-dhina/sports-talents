window.SportsConnect = window.SportsConnect || {};

SportsConnect.sampleData = {
    currentUser: {
        id: 1,
        name: "Arun Kumar",
        username: "arunkumar_run",
        role: "athlete", // athlete, coach, scout, organizer, team, school
        avatar: "🏃‍♂️",
        avatarBg: "linear-gradient(135deg, #FF6B35, #FF9F1C)",
        coverColor: "linear-gradient(135deg, #0F2027, #203A43, #2C5364)",
        sport: "Athletics",
        subSport: "100m / 200m Sprint",
        bio: "District 100m sprint champion from Silukuvarpatti village, Tamil Nadu. Aiming for National Team selection. ⚡",
        location: {
            village: "Silukuvarpatti",
            district: "Theni",
            state: "Tamil Nadu",
            country: "India"
        },
        stats: {
            posts: 18,
            followers: 1240,
            following: 185,
            achievements: 8,
            views: "42.5k"
        },
        athleticStats: [
            { label: "100m PB", value: "10.42s", trend: "District Record" },
            { label: "200m PB", value: "21.15s", trend: "State Level" },
            { label: "Top Speed", value: "34.8 km/h", trend: "Measured Dec '25" },
            { label: "Rank", value: "#3 State", trend: "U-21 Men" }
        ],
        achievements: [
            { id: 1, title: "District Athletics Champion", event: "Theni Annual Athletics Meet 2025", date: "Nov 2025", type: "gold", icon: "🥇" },
            { id: 2, title: "State Junior Sprint Silver", event: "TN State Junior Championship", date: "Aug 2025", type: "silver", icon: "🥈" },
            { id: 3, title: "Rural Sports Festival Winner", event: "TN Rural Youth Talent Hunt", date: "May 2025", type: "gold", icon: "🏆" }
        ],
        verified: true,
        joinedDate: "Jan 2024"
    },

    users: [
        {
            id: 1,
            name: "Arun Kumar",
            username: "arunkumar_run",
            role: "athlete",
            avatar: "🏃‍♂️",
            avatarBg: "linear-gradient(135deg, #FF6B35, #FF9F1C)",
            sport: "Athletics",
            location: { village: "Silukuvarpatti", district: "Theni", state: "Tamil Nadu" },
            followers: 1240,
            following: 185,
            verified: true,
            bio: "District 100m champion sprint athlete."
        },
        {
            id: 2,
            name: "Coach Ravi Shankar",
            username: "coach_ravi",
            role: "coach",
            avatar: "👨‍🏫",
            avatarBg: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            sport: "Athletics",
            location: { village: "Periyakulam", district: "Theni", state: "Tamil Nadu" },
            followers: 3420,
            following: 310,
            verified: true,
            bio: "Senior Sprint & Field Athletics Coach. Trained 5 National medalists."
        },
        {
            id: 3,
            name: "Kavitha Murugan",
            username: "kavitha_kabaddi",
            role: "athlete",
            avatar: "🤼‍♀️",
            avatarBg: "linear-gradient(135deg, #EC4899, #DB2777)",
            sport: "Kabaddi",
            location: { village: "Othakadai", district: "Madurai", state: "Tamil Nadu" },
            followers: 2890,
            following: 140,
            verified: true,
            bio: "Raider for Madurai District Team. Pro Kabaddi League Aspirant."
        },
        {
            id: 4,
            name: "Senthil Kumar",
            username: "senthil_bowler",
            role: "athlete",
            avatar: "🏏",
            avatarBg: "linear-gradient(135deg, #10B981, #059669)",
            sport: "Cricket",
            location: { village: "Usilampatti", district: "Madurai", state: "Tamil Nadu" },
            followers: 1950,
            following: 210,
            verified: false,
            bio: "Express Right-arm Fast Bowler (138 km/h). Village Tennis & Leather ball bowler."
        },
        {
            id: 5,
            name: "Priya Sharma",
            username: "priya_archery",
            role: "athlete",
            avatar: "🏹",
            avatarBg: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
            sport: "Archery",
            location: { village: "Kharkhoda", district: "Sonipat", state: "Haryana" },
            followers: 4120,
            following: 95,
            verified: true,
            bio: "National Youth Archery Gold Medalist. Target: LA 2028."
        },
        {
            id: 6,
            name: "Sunil Chhetri Scout Club",
            username: "fc_greenfield",
            role: "team",
            avatar: "⚽",
            avatarBg: "linear-gradient(135deg, #059669, #047857)",
            sport: "Football",
            location: { village: "Malappuram", district: "Malappuram", state: "Kerala" },
            followers: 5800,
            following: 120,
            verified: true,
            bio: "Grassroots Football Academy scouting rural stars."
        },
        {
            id: 7,
            name: "Rajesh Singh",
            username: "scout_rajesh",
            role: "scout",
            avatar: "🧐",
            avatarBg: "linear-gradient(135deg, #F59E0B, #D97706)",
            sport: "Wrestling",
            location: { village: "Jhajjar", district: "Jhajjar", state: "Haryana" },
            followers: 1890,
            following: 620,
            verified: true,
            bio: "Talent Scout for National Sports Authority. Scouting Dangal & Mat champions."
        },
        {
            id: 8,
            name: "Meena Devi",
            username: "meena_weightlifting",
            role: "athlete",
            avatar: "🏋️‍♀️",
            avatarBg: "linear-gradient(135deg, #EF4444, #DC2626)",
            sport: "Weightlifting",
            location: { village: "Nongpok Kakching", district: "Imphal East", state: "Manipur" },
            followers: 3100,
            following: 80,
            verified: true,
            bio: "55kg Weightlifter. Snatch 88kg / Clean & Jerk 112kg."
        }
    ],

    sports: [
        { id: "athletics", name: "Athletics", icon: "🏃‍♂️", color: "linear-gradient(135deg, #FF6B35, #FF9F1C)", athletes: 1240, teams: 85, category: "Individual / Track" },
        { id: "cricket", name: "Cricket", icon: "🏏", color: "linear-gradient(135deg, #10B981, #059669)", athletes: 3890, teams: 340, category: "Team Sport" },
        { id: "kabaddi", name: "Kabaddi", icon: "🤼‍♂️", color: "linear-gradient(135deg, #EC4899, #DB2777)", athletes: 2150, teams: 190, category: "Contact / Traditional" },
        { id: "football", name: "Football", icon: "⚽", color: "linear-gradient(135deg, #3B82F6, #2563EB)", athletes: 4120, teams: 280, category: "Team Sport" },
        { id: "volleyball", name: "Volleyball", icon: "🏐", color: "linear-gradient(135deg, #F59E0B, #D97706)", athletes: 1680, teams: 145, category: "Team Sport" },
        { id: "badminton", name: "Badminton", icon: "🏸", color: "linear-gradient(135deg, #8B5CF6, #7C3AED)", athletes: 1940, teams: 60, category: "Racquet Sport" },
        { id: "wrestling", name: "Wrestling (Dangal)", icon: "🤼‍♀️", color: "linear-gradient(135deg, #EF4444, #DC2626)", athletes: 980, teams: 45, category: "Combat / Traditional" },
        { id: "weightlifting", name: "Weightlifting", icon: "🏋️‍♂️", color: "linear-gradient(135deg, #6366F1, #4F46E5)", athletes: 640, teams: 30, category: "Strength" },
        { id: "archery", name: "Archery", icon: "🏹", color: "linear-gradient(135deg, #14B8A6, #0D9488)", athletes: 520, teams: 25, category: "Precision" },
        { id: "hockey", name: "Field Hockey", icon: "🏑", color: "linear-gradient(135deg, #0284C7, #0369A1)", athletes: 1120, teams: 95, category: "Team Sport" },
        { id: "boxing", name: "Boxing", icon: "🥊", color: "linear-gradient(135deg, #B91C1C, #991B1B)", athletes: 750, teams: 40, category: "Combat" },
        { id: "swimming", name: "Swimming", icon: "🏊‍♂️", color: "linear-gradient(135deg, #06B6D4, #0891B2)", athletes: 830, teams: 35, category: "Water Sports" },
        { id: "silambam", name: "Silambam & Martial Arts", icon: "🥋", color: "linear-gradient(135deg, #D97706, #B45309)", athletes: 1430, teams: 110, category: "Traditional / Heritage" },
        { id: "kho_kho", name: "Kho Kho", icon: "🏃‍♀️", color: "linear-gradient(135deg, #A855F7, #9333EA)", athletes: 1820, teams: 160, category: "Traditional Team" },
        { id: "basketball", name: "Basketball", icon: "🏀", color: "linear-gradient(135deg, #EA580C, #C2410C)", athletes: 1290, teams: 90, category: "Team Sport" },
        { id: "table_tennis", name: "Table Tennis", icon: "🏓", color: "linear-gradient(135deg, #10B981, #047857)", athletes: 670, teams: 28, category: "Racquet Sport" },
        { id: "chess", name: "Chess", icon: "♟️", color: "linear-gradient(135deg, #4B5563, #1F2937)", athletes: 1540, teams: 50, category: "Mind Sport" }
    ],

    posts: [
        {
            id: 101,
            authorId: 1,
            authorName: "Arun Kumar",
            username: "arunkumar_run",
            authorAvatar: "🏃‍♂️",
            avatarBg: "linear-gradient(135deg, #FF6B35, #FF9F1C)",
            verified: true,
            sport: "Athletics",
            location: "Silukuvarpatti, Theni",
            time: "2 hours ago",
            text: "New Personal Best! clocked 10.42s in 100m sprint trials on our village muddy tracks today. Morning training with Coach Ravi is paying off big time! ⚡💨 #RuralTalent #Athletics #100mSprint #TheniSports",
            type: "achievement",
            achievementTitle: "🏆 100m District PB - 10.42s",
            media: {
                type: "image",
                aspect: "16/9",
                gradient: "linear-gradient(135deg, #1e3c72, #2a5298)",
                caption: "⚡ Finish line sprint trial at Silukuvarpatti Stadium grounds"
            },
            likes: 142,
            comments: 18,
            shares: 12,
            isLiked: false,
            isSaved: false
        },
        {
            id: 102,
            authorId: 3,
            authorName: "Kavitha Murugan",
            username: "kavitha_kabaddi",
            authorAvatar: "🤼‍♀️",
            avatarBg: "linear-gradient(135deg, #EC4899, #DB2777)",
            verified: true,
            sport: "Kabaddi",
            location: "Othakadai, Madurai",
            time: "5 hours ago",
            text: "Super Raid during Madurai District League semi-finals! Scored 4 raid points in a single breath to turn the game around. Huge thanks to our rural kabaddi club for constant support! 🔥🤼‍♀️",
            type: "normal",
            media: {
                type: "video",
                gradient: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                duration: "0:45",
                views: "3.4k",
                caption: "▶️ Watch 4-Point Super Raid Clip"
            },
            likes: 310,
            comments: 42,
            shares: 55,
            isLiked: true,
            isSaved: true
        },
        {
            id: 103,
            authorId: 4,
            authorName: "Senthil Kumar",
            username: "senthil_bowler",
            authorAvatar: "🏏",
            avatarBg: "linear-gradient(135deg, #10B981, #059669)",
            verified: false,
            sport: "Cricket",
            location: "Usilampatti, Madurai",
            time: "1 day ago",
            text: "5-wicket haul (5/14) in Usilampatti Premier League finals today! Clean bowled 3 batsmen with yorkers. Looking for opportunities in TNCA Division Leagues. Scouts & Coaches please check out video clips! 🏏💥",
            type: "achievement",
            achievementTitle: "🥇 5-Wicket Haul in UPL Finals",
            media: {
                type: "image",
                aspect: "4/3",
                gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
                caption: "🏏 Match ball & 5-wicket trophy presentation"
            },
            likes: 188,
            comments: 29,
            shares: 24,
            isLiked: false,
            isSaved: false
        },
        {
            id: 104,
            authorId: 5,
            authorName: "Priya Sharma",
            username: "priya_archery",
            authorAvatar: "🏹",
            avatarBg: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
            verified: true,
            sport: "Archery",
            location: "Sonipat, Haryana",
            time: "2 days ago",
            text: "Hit 6 consecutive 10s at 70m distance in today's archery target practice! Dedicating this consistency to rural academy coaches who trained me from childhood. 🎯🏹",
            type: "normal",
            media: {
                type: "image",
                aspect: "16/9",
                gradient: "linear-gradient(135deg, #4e54c8, #8f94fb)",
                caption: "🎯 Target board showing perfect bullseye cluster"
            },
            likes: 520,
            comments: 64,
            shares: 38,
            isLiked: true,
            isSaved: false
        },
        {
            id: 105,
            authorId: 2,
            authorName: "Coach Ravi Shankar",
            username: "coach_ravi",
            authorAvatar: "👨‍🏫",
            avatarBg: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            verified: true,
            sport: "Athletics",
            location: "Theni, Tamil Nadu",
            time: "3 days ago",
            text: "Conducting Free Rural Athletics Talent Selection Trials in Periyakulam on March 15th! Open to boys & girls under 18 from nearby villages. Top 5 talents will get full academy sponsorship! Spread the word! 📢🏅",
            type: "event_announcement",
            media: {
                type: "image",
                aspect: "16/9",
                gradient: "linear-gradient(135deg, #ff416c, #ff4b2b)",
                caption: "📢 Poster: Free Rural Talent Hunt Trials - Periyakulam"
            },
            likes: 410,
            comments: 53,
            shares: 110,
            isLiked: false,
            isSaved: true
        }
    ],

    events: [
        {
            id: 201,
            title: "Tamil Nadu Rural Sports Talent Championship 2026",
            sport: "Athletics",
            sportIcon: "🏃‍♂️",
            bannerGradient: "linear-gradient(135deg, #FF6B35, #FF9F1C)",
            date: "15-18 Mar 2026",
            day: "15",
            month: "MAR",
            status: "Upcoming", // Upcoming, Ongoing, Completed
            venue: "SDAT Stadium, Theni",
            location: "Theni, Tamil Nadu",
            organizer: "Tamil Nadu Rural Sports Federation & SportsConnect",
            deadline: "Mar 10, 2026",
            participantsCount: 420,
            maxParticipants: 500,
            prizePool: "₹2,50,000",
            category: "District & State Level",
            description: "Annual grassroots talent hunt covering 100m, 200m, 400m, Long Jump, High Jump, and Shotput for athletes from rural panchayats.",
            rules: [
                "Open to athletes holding rural village residence certificate.",
                "Categories: U-16, U-19, Open Senior Men & Women.",
                "SPIKE shoes permitted. Electronic timing used.",
                "Medals, Certificates, and Cash Prizes for top 3 finishers."
            ]
        },
        {
            id: 202,
            title: "Madurai District Premier Kabaddi League",
            sport: "Kabaddi",
            sportIcon: "🤼‍♂️",
            bannerGradient: "linear-gradient(135deg, #EC4899, #DB2777)",
            date: "22-25 Mar 2026",
            day: "22",
            month: "MAR",
            status: "Upcoming",
            venue: "MGR Race Course Indoor Stadium, Madurai",
            location: "Madurai, Tamil Nadu",
            organizer: "Madurai District Kabaddi Association",
            deadline: "Mar 18, 2026",
            participantsCount: 32,
            maxParticipants: 32,
            prizePool: "₹5,00,000",
            category: "Inter-Village Team Tournament",
            description: "16 Men's & 16 Women's Village teams compete for the prestigious District Trophy. Pro Kabaddi League scouts will be present.",
            rules: [
                "12 Players per squad (7 playing + 5 substitutes).",
                "Weight Limit: 85kg Men, 75kg Women.",
                "Mat matches with electronic scoring."
            ]
        },
        {
            id: 203,
            title: "All-India Rural Dangal & Mat Wrestling Cup",
            sport: "Wrestling (Dangal)",
            sportIcon: "🤼‍♀️",
            bannerGradient: "linear-gradient(135deg, #EF4444, #DC2626)",
            date: "05-08 Apr 2026",
            day: "05",
            month: "APR",
            status: "Upcoming",
            venue: "Champa Devi Akhada, Sonipat",
            location: "Sonipat, Haryana",
            organizer: "Haryana Kushti Parishad",
            deadline: "Apr 01, 2026",
            participantsCount: 180,
            maxParticipants: 200,
            prizePool: "₹10,00,000 + Gada Trophy",
            category: "National Open Dangal",
            description: "Traditional soil & mat wrestling tournament featuring top wrestlers from Haryana, Punjab, UP, Maharashtra, and Southern states.",
            rules: [
                "Weight categories: 57kg, 65kg, 74kg, 86kg, 97kg, 125kg.",
                "Elimination format.",
                "Top 4 wrestlers invited for SAI Coaching Camp."
            ]
        },
        {
            id: 204,
            title: "Malappuram Grassroots Football Cup",
            sport: "Football",
            sportIcon: "⚽",
            bannerGradient: "linear-gradient(135deg, #3B82F6, #2563EB)",
            date: "10-14 Feb 2026",
            day: "10",
            month: "FEB",
            status: "Completed",
            venue: "Sevens Football Ground, Kottakkal",
            location: "Malappuram, Kerala",
            organizer: "Kerala Grassroots Football Association",
            deadline: "Feb 05, 2026",
            participantsCount: 64,
            maxParticipants: 64,
            prizePool: "₹1,50,000",
            category: "Sevens Football",
            description: "High-octane village sevens football tournament. Winner: Greenfield FC Malappuram.",
            rules: [
                "7-a-side format, 40 minutes per match.",
                "Knockout fixture."
            ]
        }
    ],

    videos: [
        {
            id: 301,
            title: "100m Sprint PB 10.42s Slow-Motion Form Analysis",
            authorName: "Arun Kumar",
            authorAvatar: "🏃‍♂️",
            sport: "Athletics",
            duration: "2:15",
            views: "18.4k",
            likes: 1240,
            gradient: "linear-gradient(135deg, #1e3c72, #2a5298)",
            date: "3 days ago"
        },
        {
            id: 302,
            title: "Unstoppable 4-Point Super Raid | Madurai League",
            authorName: "Kavitha Murugan",
            authorAvatar: "🤼‍♀️",
            sport: "Kabaddi",
            duration: "1:30",
            views: "34.2k",
            likes: 2890,
            gradient: "linear-gradient(135deg, #833ab4, #fd1d1d)",
            date: "5 days ago"
        },
        {
            id: 303,
            title: "138 km/h Inswinging Yorker Compilation | Village Cricket",
            authorName: "Senthil Kumar",
            authorAvatar: "🏏",
            sport: "Cricket",
            duration: "3:45",
            views: "12.8k",
            likes: 950,
            gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
            date: "1 week ago"
        },
        {
            id: 304,
            title: "Archery 70m Target 10-Ring Precision Practice",
            authorName: "Priya Sharma",
            authorAvatar: "🏹",
            sport: "Archery",
            duration: "4:10",
            views: "22.1k",
            likes: 1820,
            gradient: "linear-gradient(135deg, #4e54c8, #8f94fb)",
            date: "2 weeks ago"
        }
    ],

    villages: [
        {
            name: "Silukuvarpatti",
            district: "Theni",
            state: "Tamil Nadu",
            icon: "🌄",
            athletesCount: 42,
            topSport: "Athletics & Silambam",
            featuredTalent: "Arun Kumar (100m Champion)",
            gradient: "linear-gradient(135deg, #D97706, #78350F)"
        },
        {
            name: "Othakadai",
            district: "Madurai",
            state: "Tamil Nadu",
            icon: "🌾",
            athletesCount: 68,
            topSport: "Kabaddi & Weightlifting",
            featuredTalent: "Kavitha Murugan (Pro Kabaddi Raider)",
            gradient: "linear-gradient(135deg, #059669, #064E3B)"
        },
        {
            name: "Kharkhoda",
            district: "Sonipat",
            state: "Haryana",
            icon: "🚜",
            athletesCount: 115,
            topSport: "Wrestling & Archery",
            featuredTalent: "Priya Sharma (Archery Gold)",
            gradient: "linear-gradient(135deg, #2563EB, #1E3A8A)"
        },
        {
            name: "Nongpok Kakching",
            district: "Imphal East",
            state: "Manipur",
            icon: "⛰️",
            athletesCount: 88,
            topSport: "Weightlifting & Boxing",
            featuredTalent: "Meena Devi (National Weightlifter)",
            gradient: "linear-gradient(135deg, #7C3AED, #4C1D95)"
        }
    ],

    notifications: [
        { id: 1, type: "like", text: "<strong>Coach Ravi Shankar</strong> liked your post 'New Personal Best 10.42s'.", time: "10 mins ago", read: false },
        { id: 2, type: "comment", text: "<strong>Rajesh Singh (Scout)</strong> commented: 'Impressive sprint timing! Are you available for trials in Chennai?'", time: "1 hour ago", read: false },
        { id: 3, type: "follow", text: "<strong>Sunil Chhetri Scout Club</strong> started following your profile.", time: "3 hours ago", read: true },
        { id: 4, type: "event", text: "New event registration open: <strong>Tamil Nadu Rural Sports Championship</strong>.", time: "Yesterday", read: true }
    ],

    conversations: [
        {
            id: 1,
            user: {
                id: 2,
                name: "Coach Ravi Shankar",
                avatar: "👨‍🏫",
                role: "Coach",
                online: true
            },
            unread: 1,
            lastTime: "10:30 AM",
            lastMessage: "Great run today Arun! Let's focus on explosive starting block reaction tomorrow.",
            messages: [
                { id: 1, senderId: 2, text: "Hi Arun, saw your 10.42s PB post! Fantastic improvement.", time: "10:15 AM" },
                { id: 2, senderId: 1, text: "Thank you Coach Ravi! Your guidance on stride frequency made the difference.", time: "10:22 AM" },
                { id: 3, senderId: 2, text: "Great run today Arun! Let's focus on explosive starting block reaction tomorrow.", time: "10:30 AM" }
            ]
        },
        {
            id: 2,
            user: {
                id: 7,
                name: "Rajesh Singh",
                avatar: "🧐",
                role: "Scout",
                online: false
            },
            unread: 0,
            lastTime: "Yesterday",
            lastMessage: "We are reviewing your video footage for national squad recommendation.",
            messages: [
                { id: 1, senderId: 7, text: "Hello Arun, I am a talent scout for national sports authority. We've been tracking your sprint times.", time: "Yesterday" },
                { id: 2, senderId: 1, text: "Honored to connect Sir! Please let me know if you need full trial video logs.", time: "Yesterday" },
                { id: 3, senderId: 7, text: "We are reviewing your video footage for national squad recommendation.", time: "Yesterday" }
            ]
        }
    ]
};
