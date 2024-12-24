import styled from "styled-components";
export const MediaSectionWrapper = styled.div<{ $isMobile: boolean }>`  
    padding-left: ${({ $isMobile }) => $isMobile ? '0' : '1rem'};
`;