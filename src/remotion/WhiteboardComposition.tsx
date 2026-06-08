import React from "react";
import { AbsoluteFill, Sequence, Audio, interpolate } from "remotion";
import type { Project, WhiteboardElement, AudioTrack } from "@/store/types";
import { SVGPathElement } from "./elements/SVGPathElement";
import { TextElement } from "./elements/TextElement";
import { ImageElement } from "./elements/ImageElement";
import { ShapeElement } from "./elements/ShapeElement";
import { Hand } from "./Hand";
import { Camera } from "./Camera";
import { StyleBackground } from "./backgrounds/StyleBackground";
import { StyleFilters } from "./backgrounds/StyleFilters";
import { getStyleDefinition } from "@/lib/video-styles";

function ElementRenderer({ element, videoStyle }: { element: WhiteboardElement; videoStyle: string }) {
  switch (element.data.type) {
    case "svg-path":
      return <SVGPathElement element={element} videoStyle={videoStyle} />;
    case "text":
      return <TextElement element={element} videoStyle={videoStyle} />;
    case "image":
      return <ImageElement element={element} />;
    case "shape":
      return <ShapeElement element={element} videoStyle={videoStyle} />;
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
  const videoStyle = project.videoStyle || "classic-whiteboard";
  const styleDef = getStyleDefinition(videoStyle);

  const sortedElements = [...project.elements]
    .filter((el) => el.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  const hasCamera = project.cameraKeyframes.length > 0;

  const elementContent = (
    <>
      {sortedElements.map((element) => (
        <Sequence key={element.id} from={element.startFrame}>
          <ElementRenderer element={element} videoStyle={videoStyle} />
        </Sequence>
      ))}
      {styleDef.showHand && (
        <Hand elements={sortedElements} handVariant={styleDef.handVariant} />
      )}
    </>
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: project.backgroundColor || styleDef.backgroundColor,
        overflow: "hidden",
      }}
    >
      {/* SVG filter definitions for style-specific effects */}
      <StyleFilters style={videoStyle} />

      {/* Style-specific background pattern */}
      <StyleBackground
        style={videoStyle}
        width={project.width}
        height={project.height}
      />

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
