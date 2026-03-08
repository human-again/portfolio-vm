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
        <div className="grid grid-cols-3 gap-2">
          {fun.photos.map((photo, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-border">
              <Image
                src={photo}
                alt={`Fun photo ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
