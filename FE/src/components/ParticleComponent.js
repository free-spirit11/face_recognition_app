import React, { useCallback } from 'react';
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import particlesOptions from "../particles.json";


function ParticleComponent() {
    const particlesInit = useCallback(main => {
        loadFull(main);
    }, [])

    return (
        <div>
            <Particles className="particles" options={particlesOptions} init={particlesInit} />
        </div>
    );
}

export default ParticleComponent;