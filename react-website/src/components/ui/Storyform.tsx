"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { StoryParams, Story } from '../../app/types/story';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const StoryForm: React.FC = () => {
  const [theme, setTheme] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [stages, setStages] = useState<string[]>(['']);
  const [numPlayers, setNumPlayers] = useState<number>();
  const [timeLimit, setTimeLimit] = useState<number>();
  const [story, setStory] = useState<Story | null>(null);
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);

  const handleAddStage = () => setStages([...stages, '']);
  
  const handleStageChange = (index: number, value: string) => {
    const newStages = [...stages];
    newStages[index] = value;
    setStages(newStages);
  };

  const generateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsButtonClicked(true); 
    try {
      const response = await axios.post<Story>('/api/generateStory', {
        theme,
        difficulty,
        stage_physical_descriptions: stages,
        num_players: numPlayers,
        time_limit_min: timeLimit,
      });
      setStory(response.data);
    } catch (error) {
      console.error('Error generating story:', error);
    }
  };

  const runGame = async () => {
    try {
      const response = await axios.post('/api/runGame', {
      });
      console.log('Run action response:', response.data);
    } catch (error) {
      console.error('Error running action:', error);
    }
  };

  const resetForm = () => {
    // Reset form fields and story state
    setTheme('');
    setDifficulty('Easy');
    setStages(['']);
    setNumPlayers(0);
    setTimeLimit(0);
    setStory(null);
    setIsButtonClicked(false);
  };

  const demoForm = () => {
    setTheme('Escape from a submarine');
    setDifficulty('Hard');
    setStages(['There is a box with 5 switches, each connected to a light. Each light can be different colors. Make all the lights match by flipping switches.']);
    setNumPlayers(3);
    setTimeLimit(25);
    setIsButtonClicked(false);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground p-4">
      <div className="story-form bg-foreground text-background rounded-lg shadow-lg p-6 w-full max-w-md bg-zinc-800">
        <form onSubmit={generateStory} className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold mb-6 text-white text-center">Generate Your Escape Room Story</h1>

          {/* Theme Input */}
          <Input 
            className="w-full bg-white text-black"
            placeholder="Enter Theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />

          {/* Difficulty Select */}
          <Select onValueChange={(value) => setDifficulty(value)} value={difficulty}>
            <SelectTrigger className="w-full bg-white text-black">
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          {/* Stages Input */}
          {stages.map((stage, index) => (
            <Input
              key={index}
              className="w-full bg-white text-black"
              placeholder={`Stage ${index + 1} Description`}
              value={stage}
              onChange={(e) => handleStageChange(index, e.target.value)}
            />
          ))}
          {/* Prevent form submission on clicking this button */}
          <Button type="button" variant="outline" onClick={handleAddStage} className="self-center">
            Add Stage
          </Button>

          {/* Number of Players & Time Limit */}
          <Input
            className="w-full bg-white text-black"
            type="number"
            placeholder="Number of Players"
            value={numPlayers}
            onChange={(e) => setNumPlayers(parseInt(e.target.value))}
          />
          <Input
            className="w-full bg-white text-black"
            type="number"
            placeholder="Time Limit (minutes)"
            value={timeLimit}
            onChange={(e) => setTimeLimit(parseInt(e.target.value))}
          />

          {/* Reset Button */}
          <Button type="button" variant="default" className="w-full" onClick={demoForm}>
            Fill Demo
          </Button>

          {/* Submit Button */}
          <Button type="submit" variant="default" className="w-full" disabled={isButtonClicked}>
            Generate Story
          </Button>

          {/* Run Button */}
          <Button type="button" variant="outline" className="w-full" onClick={runGame} disabled={!story}>
            Run
          </Button>

          {/* Reset Button */}
          <Button type="button" variant="outline" className="w-full" onClick={resetForm} disabled={!story}>
            Reset
          </Button>
        </form>

        {/* Display Generated Story */}
        {story && (
          <div className="mt-8 p-4 bg-background text-foreground rounded-md shadow-md">
            <h2 className="text-xl font-bold">Generated Story</h2>
            <p><strong>Intro:</strong> {story.intro}</p>
            <h3 className="font-bold my-4">Stages:</h3>
            <ul>
              {story.stages.map((stage, index) => (
                <div key={index}>
                  <li className="my-4">Stage {index + 1}: {stage.description}</li>
                  <p>Success Message: {stage.success_message}</p>
                  <p>Failure Message: {stage.failure_message}</p>
                </div>
              ))}
            </ul>
            <p className="my-4"><strong>Good Ending:</strong> {story.good_ending}</p>
            <p className="my-4"><strong>Bad Ending:</strong> {story.bad_ending}</p>
          </div>
        )}
      </div>
    </div>
  );
};
  
export default StoryForm;
