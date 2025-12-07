/**
 * Chat Service
 * Handles AI chat responses and chat-related business logic
 */

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

/**
 * Get AI response based on user message
 * This is a placeholder - in production, this would call an actual AI API
 */
export function getAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes("admission") || lowerMessage.includes("requirement")) {
    return "For admission to FAST University, you need to:\n\n1. Pass the FAST Entry Test (NET)\n2. Have a minimum of 60% marks in FSc/A-Levels\n3. Submit your application before the deadline\n\nThe entry test covers English, Mathematics, and IQ/Analytical sections. Would you like more details about any specific requirement?"
  }

  if (lowerMessage.includes("entry test") || lowerMessage.includes("net")) {
    return "The FAST National Entry Test (NET) is conducted multiple times a year:\n\n- **Test Dates**: Usually in June-July and December-January\n- **Duration**: 2 hours\n- **Sections**: English, Mathematics, IQ/Analytical\n- **Format**: MCQs (100 questions)\n\nWould you like to start practicing with our test preparation module?"
  }

  if (lowerMessage.includes("fee") || lowerMessage.includes("cost")) {
    return "The fee structure at FAST varies by program:\n\n- **BS Programs**: ~PKR 180,000-220,000 per semester\n- **MS Programs**: ~PKR 200,000-250,000 per semester\n- **PhD Programs**: ~PKR 150,000-180,000 per semester\n\nScholarships are available based on merit and need. Would you like information about financial aid?"
  }

  if (lowerMessage.includes("campus") || lowerMessage.includes("location")) {
    return "FAST has campuses in major cities across Pakistan:\n\n1. **Islamabad** - Main campus\n2. **Lahore** - Faisal Town\n3. **Karachi** - FAST-NUCES\n4. **Peshawar** - Near GT Road\n5. **Chiniot-Faisalabad**\n\nEach campus offers state-of-the-art facilities. Would you like to take a virtual tour?"
  }

  if (lowerMessage.includes("program") || lowerMessage.includes("course")) {
    return "FAST offers a variety of undergraduate and graduate programs:\n\n**Undergraduate:**\n- BS Computer Science\n- BS Software Engineering\n- BS Data Science\n- BS Artificial Intelligence\n- BS Electrical Engineering\n- BS Business Administration\n\n**Graduate:**\n- MS Computer Science\n- MS Data Science\n- MBA\n\nWhich program interests you?"
  }

  return "That's a great question! I'd be happy to help you with information about FAST University. Could you please be more specific about what you'd like to know? I can help with:\n\n- Admission requirements\n- Entry test details\n- Fee structure\n- Campus information\n- Available programs\n- Scholarships"
}

/**
 * Process chat message and return AI response
 * In production, this would make an API call to an AI service
 */
export async function processChatMessage(userMessage: string): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))
  
  return getAIResponse(userMessage)
}

