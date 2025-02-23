import os
import subprocess

def convert_videos(input_folder, output_folder):
    # Zorg ervoor dat de outputmap bestaat
    os.makedirs(output_folder, exist_ok=True)

    # Ondersteunde videoformaten
    video_extensions = (".mp4", ".mov", ".avi", ".mkv")

    # Loop door alle bestanden in de inputmap
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(video_extensions):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, f"{os.path.splitext(filename)[0]}_web.mp4")

            print(f"\n🚀 Converting: {filename} -> {output_path}")

            # FFmpeg commando
            command = [
                "ffmpeg", "-i", input_path,
                "-c:v", "libx264", "-crf", "22", "-preset", "fast",
                "-c:a", "aac", "-b:a", "192k",
                "-movflags", "+faststart",
                output_path
            ]

            # Voer FFmpeg uit met realtime logging
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)

            # Lees en print de output regel voor regel
            for line in process.stdout:
                print(line, end="")  # Realtime output van FFmpeg

            process.wait()  # Wacht tot FFmpeg klaar is

    print("\n✅ Alle video's zijn geconverteerd!")

if __name__ == "__main__":
    print(os.environ['videoInputFolder'])
    convert_videos(os.environ["videoInputFolder"], os.environ["videoOutputFolder"])