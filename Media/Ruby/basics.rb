module Basics
  def self.even(number)
    raise ArgumentError.new("expected an int or float") unless number.is_a?(Integer) || number.is_a?(Float)

    number % 2 == 0
  end 

  def self.length(sequence)
    raise ArgumentError.new("expected an array") unless sequence.is_a?(Array)

    sequence.size
  end
end