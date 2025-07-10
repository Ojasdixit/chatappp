-- Insert Categories (skip if they already exist)
INSERT INTO blog_categories (name, slug, description, seo_title, seo_description, seo_keywords, created_at, updated_at)
VALUES 
('Viral News', 'viral-news', 'Latest trending news and viral stories', 'Viral News - Latest Trending Stories', 'Stay updated with the most viral news and trending stories from around the world', ARRAY['viral news', 'trending stories', 'latest news', 'viral updates'], NOW(), NOW()),
('Omegle', 'omegle', 'Everything about Omegle and its alternatives', 'Omegle Guide - Features, Tips & Alternatives', 'Complete guide to Omegle including features, safety tips, and best alternatives', ARRAY['omegle', 'omegle alternatives', 'random chat', 'video chat'], NOW(), NOW()),
('Safety Tips', 'safety-tips', 'Stay safe while chatting online', 'Online Safety Tips for Random Chat Users', 'Essential safety tips to protect yourself while using random chat platforms', ARRAY['online safety', 'chat safety', 'privacy tips', 'anonymous chat safety'], NOW(), NOW()),
('App Reviews', 'app-reviews', 'In-depth reviews of chat applications', 'Best Random Chat Apps - Honest Reviews', 'Unbiased reviews of the top random chat applications and platforms', ARRAY['chat app reviews', 'best chat apps', 'app comparisons', 'video chat reviews'], NOW(), NOW())
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords, created_at = EXCLUDED.created_at, updated_at = EXCLUDED.updated_at;

-- Insert Tags (skip if they already exist)
INSERT INTO blog_tags (name, slug, created_at)
VALUES 
('Omegle', 'omegle', NOW()),
('Video Chat', 'video-chat', NOW()),
('Safety', 'safety', NOW()),
('Trending', 'trending', NOW()),
('Tips', 'tips', NOW()),
('Alternatives', 'alternatives', NOW()),
('Review', 'review', NOW()),
('Guide', 'guide', NOW())
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, created_at = EXCLUDED.created_at;

-- Insert Blog Posts with their tags in a single transaction
DO $$
DECLARE
  post1_id UUID;
  post2_id UUID;
  post3_id UUID;
BEGIN
  -- Post 1: Omegle Shutdown Aftermath
  INSERT INTO blog_posts (
    title, slug, excerpt, content, featured_image_url, category_id, 
    is_published, published_at, seo_title, seo_description, seo_keywords, 
    seo_canonical_url, seo_meta_robots, seo_og_title, seo_og_description, 
    seo_og_image, seo_twitter_card, seo_twitter_title, seo_twitter_description, 
    seo_twitter_image, view_count, average_read_time, created_at, updated_at
  ) VALUES (
    'Life After Omegle: The Best Alternatives in 2025', 
    'life-after-omegle-best-alternatives-2025', 
    'With Omegle''s shutdown, users are searching for the best alternatives. Here are the top platforms that have emerged as worthy successors.',
    '<p>The internet was taken by surprise when Omegle, the pioneer of random video chat, announced its shutdown in late 2023. After 17 years of connecting strangers from around the world, the platform cited financial and technological challenges as the primary reasons for its closure. But fear not, as several worthy alternatives have risen to fill the void.</p>
    <h2>Why Did Omegle Shut Down?</h2>
    <p>Omegle''s shutdown came after years of battling with moderation issues, rising operational costs, and increasing competition. The platform, which started in 2009, struggled to maintain a safe environment while keeping the service free and accessible.</p>
    <h2>Top Omegle Alternatives in 2025</h2>
    <h3>1. ChatRoulette</h3>
    <p>One of Omegle''s earliest competitors, ChatRoulette has significantly improved its moderation and user experience, making it a top choice for random video chats.</p>
    <h3>2. Emerald Chat</h3>
    <p>Emerald Chat offers a more moderated experience with interest matching, making it easier to find like-minded individuals.</p>
    <h3>3. Shagle</h3>
    <p>With advanced filtering options and a large user base, Shagle has become a favorite for those seeking specific types of conversations.</p>
    <h2>Staying Safe on Random Chat Platforms</h2>
    <p>Remember to always protect your personal information and be cautious when sharing any details with strangers online. Use platforms with strong moderation and reporting features.</p>',
    'https://images.unsplash.com/photo-1516321318423-f06a85f508d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    (SELECT id FROM blog_categories WHERE slug = 'omegle'),
    true,
    NOW() - INTERVAL '5 days',
    'Best Omegle Alternatives in 2025 - Top Random Chat Sites',
    'Discover the best Omegle alternatives for random video chatting in 2025. Compare features, safety, and user experience of top platforms.',
    ARRAY['omegle alternatives', 'random chat sites', 'video chat platforms', 'omegle replacement', 'best chat roulette sites'],
    'https://yourwebsite.com/blog/life-after-omegle-best-alternatives-2025',
    'index, follow',
    'Life After Omegle: The Best Alternatives in 2025',
    'Discover the top Omegle alternatives for random video chatting in 2025. Compare features, safety, and user experience.',
    'https://images.unsplash.com/photo-1516321318423-f06a85f508d9?ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'summary_large_image',
    'Life After Omegle: The Best Alternatives in 2025',
    'Discover the top Omegle alternatives for random video chatting in 2025. Compare features, safety, and user experience.',
    'https://images.unsplash.com/photo-1516321318423-f06a85f508d9?ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    1245,
    8,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '5 days'
  )
  RETURNING id INTO post1_id;

  -- Post 1 Tags - No need for ON CONFLICT as we're using a transaction and checking existence first
  INSERT INTO blog_post_tags (post_id, tag_id)
  SELECT 
    post1_id,
    id 
  FROM blog_tags 
  WHERE slug IN ('omegle', 'alternatives', 'guide', 'trending')
  AND NOT EXISTS (
    SELECT 1 FROM blog_post_tags 
    WHERE post_id = post1_id AND tag_id = blog_tags.id
  );

  -- Post 2: Online Safety Guide
  INSERT INTO blog_posts (
    title, 
    slug, 
    excerpt, 
    content, 
    featured_image_url, 
    category_id, 
    is_published,
    published_at, 
    seo_title, 
    seo_description, 
    seo_keywords, 
    seo_canonical_url, 
    seo_meta_robots, 
    seo_og_title, 
    seo_og_description, 
    seo_og_image, 
    seo_twitter_card, 
    seo_twitter_title, 
    seo_twitter_description, 
    seo_twitter_image, 
    view_count, 
    average_read_time, 
    created_at, 
    updated_at
  )
  VALUES (
    '10 Essential Safety Tips for Random Chat Users in 2025', 
    'safety-tips-random-chat-2025', 
    'Stay safe while meeting new people online with these essential safety tips for random chat platforms.',
    '<p>Random chat platforms offer exciting opportunities to meet new people, but they also come with risks. Here are 10 essential safety tips to protect yourself while using these services.</p>
    <h2>1. Protect Your Personal Information</h2>
    <p>Never share personal details like your full name, address, phone number, or financial information with strangers.</p>
    <h2>2. Use a VPN</h2>
    <p>A Virtual Private Network (VPN) helps protect your IP address and location from being tracked.</p>
    <h2>3. Be Wary of Scams</h2>
    <p>Be cautious of anyone asking for money or personal favors, especially if you''ve just met them.</p>
    <h2>4. Report Suspicious Behavior</h2>
    <p>Most platforms have reporting features. Don''t hesitate to use them if someone makes you uncomfortable.</p>
    <h2>5. Use Platform Moderation Features</h2>
    <p>Familiarize yourself with the platform''s safety features, including blocking and reporting tools.</p>',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    (SELECT id FROM blog_categories WHERE slug = 'safety-tips'),
    true,
    NOW() - INTERVAL '3 days',
    '10 Essential Safety Tips for Random Chat Users in 2025',
    'Stay safe while meeting new people online with these 10 essential safety tips for random chat platforms in 2025.',
    ARRAY['online safety', 'chat safety', 'privacy tips', 'random chat safety', 'internet safety'],
    'https://yourwebsite.com/blog/safety-tips-random-chat-2025',
    'index, follow',
    '10 Essential Safety Tips for Random Chat Users in 2025',
    'Learn how to stay safe while using random chat platforms with these essential safety tips.',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'summary_large_image',
    '10 Essential Safety Tips for Random Chat Users in 2025',
    'Learn how to stay safe while using random chat platforms with these essential safety tips.',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    982,
    6,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '3 days'
  )
  RETURNING id INTO post2_id;

  -- Post 2 Tags
  INSERT INTO blog_post_tags (post_id, tag_id)
  SELECT 
    post2_id,
    id 
  FROM blog_tags 
  WHERE slug IN ('safety', 'tips', 'guide')
  AND NOT EXISTS (
    SELECT 1 FROM blog_post_tags 
    WHERE post_id = post2_id AND tag_id = blog_tags.id
  );

    -- Post 3: Viral Chat App Review
  INSERT INTO blog_posts (
    title, slug, excerpt, content, featured_image_url, category_id, 
    is_published, is_featured, published_at, seo_title, seo_description, 
    seo_keywords, seo_canonical_url, seo_meta_robots, seo_og_title, 
    seo_og_description, seo_og_image, seo_twitter_card, seo_twitter_title, 
    seo_twitter_description, seo_twitter_image, view_count, average_read_time, 
    created_at, updated_at
  ) VALUES (
    'ChatVibes Review: The New Viral Chat App Taking Over in 2025', 
    'chatvibes-review-viral-chat-app-2025', 
    'ChatVibes has taken the random chat world by storm. We review its features, safety, and whether it lives up to the hype.',
    '<p>In the ever-evolving world of random chat applications, ChatVibes has emerged as a frontrunner in 2025. But does it live up to the hype? Let''s dive into our comprehensive review.</p>
    <h2>First Impressions</h2>
    <p>ChatVibes greets users with a clean, intuitive interface that''s easy to navigate. The app is available on both iOS and Android, with a web version in beta.</p>
    <h2>Key Features</h2>
    <ul>
      <li>Advanced AI moderation for safer chats</li>
      <li>Interest-based matching algorithm</li>
      <li>High-definition video and audio</li>
      <li>Virtual gifts and premium features</li>
      <li>Group chat rooms</li>
    </ul>
    <h2>Safety and Moderation</h2>
    <p>ChatVibes uses a combination of AI and human moderators to keep the platform safe. Users can report inappropriate behavior with a single tap.</p>
    <h2>Verdict</h2>
    <p>With its robust feature set and strong emphasis on safety, ChatVibes is definitely worth trying for anyone interested in random video chatting.</p>',
    'https://images.unsplash.com/photo-1516321318423-f06a85f508d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    (SELECT id FROM blog_categories WHERE slug = 'app-reviews'),
    true,
    true,
    NOW() - INTERVAL '1 day',
    'ChatVibes Review: The New Viral Chat App Taking Over in 2025',
    'Read our in-depth review of ChatVibes, the viral chat app that''s changing how we connect with strangers online in 2025.',
    ARRAY['chatvibes review', 'viral chat app', 'random video chat', 'chat app review', 'best chat app 2025'],
    'https://yourwebsite.com/blog/chatvibes-review-viral-chat-app-2025',
    'index, follow',
    'ChatVibes Review: The New Viral Chat App Taking Over in 2025',
    'Is ChatVibes the best random chat app of 2025? Read our comprehensive review to find out.',
    'https://images.unsplash.com/photo-1516321318423-f06a85f508d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'summary_large_image',
    'ChatVibes Review: The New Viral Chat App Taking Over in 2025',
    'Is ChatVibes the best random chat app of 2025? Read our comprehensive review to find out.',
    'https://images.unsplash.com/photo-1516321318423-f06a85f508d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    1567,
    7,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day'
  )
  RETURNING id INTO post3_id;

  -- Post 3 Tags
  INSERT INTO blog_post_tags (post_id, tag_id)
  SELECT 
    post3_id,
    id 
  FROM blog_tags 
  WHERE slug IN ('review', 'video-chat', 'trending')
  AND NOT EXISTS (
    SELECT 1 FROM blog_post_tags 
    WHERE post_id = post3_id AND tag_id = blog_tags.id
  );

  -- Add sample comments
  INSERT INTO blog_comments (
    post_id, 
    author_name, 
    author_email, 
    content, 
    is_approved, 
    created_at, 
    updated_at
  ) 
  SELECT 
    post1_id,
    'ChatEnthusiast',
    'user@example.com',
    'Great article! I''ve been looking for good Omegle alternatives since it shut down.',
    true,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  WHERE NOT EXISTS (
    SELECT 1 FROM blog_comments 
    WHERE post_id = post1_id 
    AND author_email = 'user@example.com'
    AND content = 'Great article! I''ve been looking for good Omegle alternatives since it shut down.'
  );

  -- Second comment
  INSERT INTO blog_comments (
    post_id, 
    author_name, 
    author_email, 
    content, 
    is_approved, 
    created_at, 
    updated_at
  ) 
  SELECT
    post2_id,
    'SafetyFirst',
    'safety@example.com',
    'These safety tips are crucial. I wish more people would follow them!',
    true,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  WHERE NOT EXISTS (
    SELECT 1 FROM blog_comments 
    WHERE post_id = post2_id 
    AND author_email = 'safety@example.com'
    AND content = 'These safety tips are crucial. I wish more people would follow them!'
  );

  -- Add post_count column if it doesn't exist
  ALTER TABLE blog_categories 
  ADD COLUMN IF NOT EXISTS post_count INTEGER DEFAULT 0;
  
  -- Update category post counts
  UPDATE blog_categories c
  SET post_count = (
    SELECT COUNT(*) 
    FROM blog_posts p 
    WHERE p.category_id = c.id
  );
  
  -- Log successful completion
  RAISE NOTICE 'Successfully inserted blog data with 3 posts, 4 categories, 8 tags, and sample comments';
  
  -- No need to commit/rollback - DO blocks automatically handle transactions
  -- Any error will automatically roll back all changes
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Error in blog data migration: %', SQLERRM;
END $$;
