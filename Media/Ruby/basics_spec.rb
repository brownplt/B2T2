require './basics'

RSpec.describe Basics do
  describe '.even' do
    context 'when input is not a number' do
      it 'fails' do
        expect{
          Basics.even("hello")
      }.to raise_error ArgumentError
      end
    end

    context 'when negative' do
      context 'when odd' do
        it 'is not even' do
          expect(Basics.even(-1)).to be false
        end
      end
  
      context 'when even' do
        it 'is even' do
          expect(Basics.even(-2)).to be true
        end
      end
    end

    context 'when zero' do
      it 'is even' do
        expect(Basics.even(0)).to be true
      end
    end

    context 'when positive' do
      context 'when odd' do
        it 'is not even' do
          expect(Basics.even(11)).to be false
        end
      end
  
      context 'when even' do
        it 'is even' do
          expect(Basics.even(10)).to be true
        end
      end
    end
  end

  describe '.length' do
    context 'when sequence has no elements' do
      it 'return length of 0' do
        expect(Basics.length([])).to be 0
      end
    end

    context 'when sequence has a single element' do
      it 'return length of 0' do
        expect(Basics.length([1])).to be 1
      end
    end

    context 'when sequence has numerous elements' do
      it 'return length of 0' do
        expect(Basics.length([1, 2, 3, 4])).to be 4
      end
    end

    context 'when input is not a sequence' do
      it 'fails' do
        expect {
          Basics.length("a")
        }.to raise_error(ArgumentError)
      end
    end
  end

  describe '.schema' do
  end

  describe '.range' do
  end

  describe '.concat' do
  end

  describe '.starts_with' do
  end

  describe '.average' do
  end

  describe '.filter' do
  end

  describe '.map' do
  end

  describe '.remove_duplicates' do
  end

  describe '.remove_all' do
  end

  describe '.col_name_of_number' do
  end
end
