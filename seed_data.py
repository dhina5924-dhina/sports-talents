import sys
import os

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.app.database import SessionLocal, engine, Base
from backend.app.models import User, Post, Media, Like, Comment, Follow, Hashtag, PostHashtag
from backend.app.auth.security import hash_password

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if users already exist
        if db.query(User).count() > 1:
            print("Database already contains data. Skipping seed.")
            return

        print("Seeding database with sports community demo data...")

        # 1. Create Users
        users_data = [
            {
                "username": "alex_runner",
                "email": "alex@sports.com",
                "password": "password123",
                "profile_picture": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                "bio": "Marathon enthusiast 🏃‍♂️ | 42k finisher | Training for Boston 2027",
                "is_admin": False
            },
            {
                "username": "sarah_cricket",
                "email": "sarah@cricket.com",
                "password": "password123",
                "profile_picture": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
                "bio": "Opening Batswoman 🏏 | All-rounder | County Championship Player",
                "is_admin": False
            },
            {
                "username": "marcus_dunk",
                "email": "marcus@hoops.com",
                "password": "password123",
                "profile_picture": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                "bio": "Point Guard 🏀 | Above the rim | Streetball & League Highlights",
                "is_admin": False
            },
            {
                "username": "elena_tennis",
                "email": "elena@tennis.com",
                "password": "password123",
                "profile_picture": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
                "bio": "Clay court specialist 🎾 | 120mph serve | WTA Tour contender",
                "is_admin": False
            },
            {
                "username": "david_kick",
                "email": "david@football.com",
                "password": "password123",
                "profile_picture": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
                "bio": "Midfield Maestro ⚽ | Free-kick Specialist | Tactics & Training",
                "is_admin": False
            }
        ]

        created_users = {}
        for u_info in users_data:
            u = User(
                username=u_info["username"],
                email=u_info["email"],
                password_hash=hash_password(u_info["password"]),
                profile_picture=u_info["profile_picture"],
                bio=u_info["bio"],
                is_admin=u_info["is_admin"]
            )
            db.add(u)
            db.commit()
            db.refresh(u)
            created_users[u.username] = u

        # Get Admin user
        admin = db.query(User).filter(User.username == "admin").first()

        # 2. Create Hashtags
        tags_list = ["cricketworld", "slamdunk", "marathontraining", "matchday", "protennis", "freekick", "fitnessmotivation"]
        created_tags = {}
        for tag in tags_list:
            ht = Hashtag(tag=tag)
            db.add(ht)
            db.commit()
            db.refresh(ht)
            created_tags[tag] = ht

        # 3. Create Posts & Media
        posts_data = [
            {
                "author": "sarah_cricket",
                "caption": "Incredible match today! Scored 84 off 52 balls in the championship final 🏏🔥 #CricketWorld #MatchDay",
                "category": "Cricket",
                "media_url": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1000&q=80",
                "media_type": "photo",
                "tags": ["cricketworld", "matchday"]
            },
            {
                "author": "marcus_dunk",
                "caption": "Game winner in overtime! Watch this step-back jumper 🏀💥 #SlamDunk #FitnessMotivation",
                "category": "Basketball",
                "media_url": "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80",
                "media_type": "photo",
                "tags": ["slamdunk", "fitnessmotivation"]
            },
            {
                "author": "david_kick",
                "caption": "Bending it into the top corner during evening training session ⚽✨ #FreeKick #MatchDay",
                "category": "Football",
                "media_url": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80",
                "media_type": "photo",
                "tags": ["freekick", "matchday"]
            },
            {
                "author": "elena_tennis",
                "caption": "Semi-finals bound! Clay season feeling extra smooth this year 🎾🏆 #ProTennis #FitnessMotivation",
                "category": "Tennis",
                "media_url": "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80",
                "media_type": "photo",
                "tags": ["protennis", "fitnessmotivation"]
            },
            {
                "author": "alex_runner",
                "caption": "Early morning 20k endurance run through the hill trails 🏃‍♀️🌄 #MarathonTraining #FitnessMotivation",
                "category": "Athletics",
                "media_url": "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1000&q=80",
                "media_type": "photo",
                "tags": ["marathontraining", "fitnessmotivation"]
            }
        ]

        created_posts = []
        for p_info in posts_data:
            author_obj = created_users[p_info["author"]]
            p = Post(
                user_id=author_obj.id,
                caption=p_info["caption"],
                category=p_info["category"]
            )
            db.add(p)
            db.commit()
            db.refresh(p)

            m = Media(
                post_id=p.id,
                media_url=p_info["media_url"],
                media_type=p_info["media_type"],
                file_size=1024 * 500
            )
            db.add(m)

            for t_name in p_info["tags"]:
                ht_obj = created_tags[t_name]
                ph = PostHashtag(post_id=p.id, hashtag_id=ht_obj.id)
                db.add(ph)

            db.commit()
            db.refresh(p)
            created_posts.append(p)

        # 4. Create Inter-User Likes & Comments
        user_list = list(created_users.values())
        for post in created_posts:
            # Add likes
            for u in user_list:
                if u.id != post.user_id:
                    like = Like(user_id=u.id, post_id=post.id)
                    db.add(like)

            # Add sample comments
            c1 = Comment(
                user_id=user_list[0].id if user_list[0].id != post.user_id else user_list[1].id,
                post_id=post.id,
                content="Absolute beast performance! Keep crushing it! 🔥⚡"
            )
            c2 = Comment(
                user_id=user_list[2].id if user_list[2].id != post.user_id else user_list[3].id,
                post_id=post.id,
                content="Incredible form and technique. Pure athletic excellence! 🏆"
            )
            db.add(c1)
            db.add(c2)

        # 5. Create Follows
        for i in range(len(user_list)):
            for j in range(len(user_list)):
                if i != j:
                    f = Follow(follower_id=user_list[i].id, following_id=user_list[j].id)
                    db.add(f)

        db.commit()
        print("Successfully seeded database with users, posts, media, comments, and interactions!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
