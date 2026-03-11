import Image from "next/image";

interface FunData {
  heading: string;
  subtitle: string;
  photos: string[];
}

export default function FunView({ fun }: { fun: FunData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">{fun.heading}</h2>
      <p className="text-muted-foreground mb-6">{fun.subtitle}</p>
      <div className="rounded-2xl bg-muted p-4">
        <ul className="grid grid-cols-3 gap-2 list-none">
          {fun.photos.map((photo, i) => (
            <li key={i} className="relative aspect-square rounded-xl overflow-hidden bg-border">
              <Image
                src={photo}
                alt={`Photo ${i + 1} — life outside code`}
                fill
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
