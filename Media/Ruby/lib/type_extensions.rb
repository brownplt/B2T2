# frozen_string_literal: true

# Boolean type, much like any other language
module Boolean
end

# std lib TrueClass we are monkey patching
class TrueClass
  include Boolean

  # yeah I'm really overriding this :)
  def class
    Boolean
  end
end

# std lib FalseClass we are monkey patching
class FalseClass
  include Boolean

  def class
    Boolean
  end
end

# source: https://stackoverflow.com/questions/2434503/ruby-factorial-function
class Integer
  def factorial
    f = 1
    for i in 1..self
      f *= i
    end
    
    f
  end
end
