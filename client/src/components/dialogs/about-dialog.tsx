import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function AboutDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-[#222] border-gray-800">
        <DialogHeader className="text-left">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-white">About Us</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Learn more about Anime Kingdom
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-3 text-gray-300 text-sm">
          <h3 className="text-lg font-semibold text-white">Our Mission</h3>
          <p>
            Anime Kingdom provides anime enthusiasts with a reliable, 
            user-friendly platform to discover, watch, and enjoy their favorite anime series and movies.
          </p>
          
          <h3 className="text-lg font-semibold text-white">Who We Are</h3>
          <p>
            A team of passionate anime fans dedicated to bringing you high-quality anime content with 
            a seamless user experience.
          </p>
          
          <h3 className="text-lg font-semibold text-white">Connect With Us</h3>
          <p>
            Join our community on Discord, Instagram, and YouTube to share your thoughts and stay updated.
          </p>

          <div className="pt-3 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Thank you for being part of our journey!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}