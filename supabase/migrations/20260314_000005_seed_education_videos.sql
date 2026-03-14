-- Seed short educational videos for lessons (OpenMed Course, CC BY).

-- Replace sample videos with OpenMed clips.
update public.lessons
set video_url = case mod(abs(hashtext(id::text)), 4)
  when 0 then 'https://archive.org/download/OpenMedCourseM2EN/OpenMedCourse_Intro_EN.mp4'
  when 1 then 'https://archive.org/download/OpenMedCourseM2EN/OpenMedCourse_M1_EN.mp4'
  when 2 then 'https://archive.org/download/OpenMedCourseM2EN/OpenMedCourse_M2_EN.mp4'
  else 'https://archive.org/download/OpenMedCourseM2EN/OpenMedCourse_M3_EN.mp4'
end
where video_url is null
  or video_url ilike 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/%';

-- Ensure every course has at least one preview lesson.
insert into public.lessons (course_id, title, video_url, duration, "order", is_preview)
select
  c.id,
  'Course overview',
  case mod(abs(hashtext(c.id::text)), 4)
    when 0 then 'https://archive.org/download/OpenMedCourseM2EN/OpenMedCourse_Intro_EN.mp4'
    when 1 then 'https://archive.org/download/OpenMedCourseM2EN/OpenMedCourse_M1_EN.mp4'
    when 2 then 'https://archive.org/download/OpenMedCourseM2EN/OpenMedCourse_M2_EN.mp4'
    else 'https://archive.org/download/OpenMedCourseM2EN/OpenMedCourse_M3_EN.mp4'
  end,
  900,
  1,
  true
from public.courses c
left join public.lessons l on l.course_id = c.id and l."order" = 1
where l.id is null
on conflict (course_id, "order") do update
set
  title = excluded.title,
  video_url = excluded.video_url,
  duration = excluded.duration,
  is_preview = excluded.is_preview;
