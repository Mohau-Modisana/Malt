function getBotResponse(input) {
    //rock paper scissors
    if (input == "Drug rash" || input == "DR" || input == "drugrash" || input == "dr" || input == "Drugrash"  ) {
        return "Drug rashes can appear as a variety of skin rashes, including pink to red bumps, hives, blisters, red patches, pus-filled bumps (pustules), or sensitivity to sunlight. Drug rashes may involve the entire skin surface, or they may be limited to one or a few body parts. Itching is common in many drug rashes.";
    } else if (input == "Erythema migrans" || input == "EM" || input == "erythema migrans" || input == "em" || input == "Erythemamigrans" ) {
        return " a rash that frequently appears as one of the first symptoms of Lyme disease. It's typically a circular red area that sometimes clears in the middle, forming a bull's-eye pattern. It can spread up to 12 inches across and may be warm to the touch.";
    } else if (input == "Pityriasis Rosea" || input == "PR" || input == "pityriasisrosea" || input == "pr" || input == "Pityriasisrosea" || input == "Pityriasis rosea" ) {
        return " a rash that usually begins as a large circular or oval spot on your chest, abdomen or back. Called a herald patch, this spot can be up to 4 inches (10 centimeters) across.";
    }else if (input == "Ring worm" || input == "RW" || input == "ringworm" || input == "rw" || input == "Ringworm" || input == "ringworm" ) {
        return "Ringworm is typically scaly and may be red and itchy. Ringworm of the scalp is common in children, where it may cause bald patches.";
    }

    // Simple responses
    if (input == "hello" || input == "hi"|| input == "Hi"|| input == "Hello") {
        return "Hello there!";
    } else if (input == "goodbye") {
        return "Talk to you later!";
    } else {
        return "Try asking something else! like : Drug rash(DR), Erythema migrans (EM), Pityriasis rosea(PR), or Ring worm(RW) to get more information";
    }
}