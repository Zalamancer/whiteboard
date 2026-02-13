import React from "react";
import { AbsoluteFill, Sequence, Audio, interpolate, useCurrentFrame } from "remotion";
import type { Project, WhiteboardElement, AudioTrack } from "@/store/types";
import { SVGPathElement } from "./elements/SVGPathElement";
import { TextElement } from "./elements/TextElement";
import { ImageElement } from "./elements/ImageElement";
import { ShapeElement } from "./elements/ShapeElement";
import { Hand } from "./Hand";
import { Camera } from "./Camera";

function ElementRenderer({ element }: { element: WhiteboardElement }) {
  switch (element.data.type) {
    case "svg-path":
      return <SVGPathElement element={element} />;
    case "text":
      return <TextElement element={element} />;
    case "image":
      return <ImageElement element={element} />;
    case "shape":
      return <ShapeElement element={element} />;
    default:
      return null;
  }
}

function AudioTrackRenderer({ track }: { track: AudioTrack }) {
  return (
    <Sequence from={track.startFrame} durationInFrames={track.durationFrames}>
      <Audio
        src={track.src}
        volume={(f) => {
          let vol = track.volume;
          if (track.fadeInFrames > 0 && f < track.fadeInFrames) {
            vol = interpolate(f, [0, track.fadeInFrames], [0, track.volume], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
          }
          if (
            track.fadeOutFrames > 0 &&
            f > track.durationFrames - track.fadeOutFrames
          ) {
            vol = interpolate(
              f,
              [track.durationFrames - track.fadeOutFrames, track.durationFrames],
              [track.volume, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
          }
          return vol;
        }}
      />
    </Sequence>
  );
}

export const WhiteboardComposition: React.FC<Record<string, unknown>> = (
  props
) => {
  const project = props as unknown as Project;
  const sortedElements = [...project.elements]
    .filter((el) => el.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  const hasCamera = project.cameraKeyframes.length > 0;

  const elementContent = (
    <>
      {sortedElements.map((element) => (
        <Sequence key={element.id} from={element.startFrame}>
          <ElementRenderer element={element} />
        </Sequence>
      ))}
      <Hand elements={sortedElements} />
    </>
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: project.backgroundColor || "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {hasCamera ? (
        <Camera keyframes={project.cameraKeyframes}>{elementContent}</Camera>
      ) : (
        elementContent
      )}

      {/* Audio tracks */}
      {project.audioTracks.map((track) => (
        <AudioTrackRenderer key={track.id} track={track} />
      ))}
    </AbsoluteFill>
  );
};
